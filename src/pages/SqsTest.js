// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ReservationPage = () => {
//     const [queuePosition, setQueuePosition] = useState(null);
//     const [isInQueue, setIsInQueue] = useState(false);
//     const [webSocket, setWebSocket] = useState(null);

//     useEffect(() => {
//         if (isInQueue && !webSocket) {
//             const ws = new WebSocket('ws://localhost:8080/queue-status?userId=USER_ID');
//             ws.onmessage = (event) => {
//                 const data = JSON.parse(event.data);
//                 console.log(data);
//                 console.log(data.position);
//                 setQueuePosition(data.position);
//                 if (data.position === 1) {
//                     // 예약 요청 처리 로직
//                     handleReservation();
//                 }
                
//             };
//             console.log('websocket연결완료');
//             setWebSocket(ws);
//         }
//         return () => {
//             if (webSocket) {
//                 webSocket.close();
//             }
//         };
//     }, [isInQueue, webSocket]);

//     const handleReservation = async () => {
//         try {
//             // const response = await axios.post('http://localhost:8080/reservation', { userId: 'USER_ID' });
//             // console.log(response.data);
//             console.log("예약 요청 가능");
//         } catch (error) {
//             console.error('Error making reservation:', error);
//         }
//     };

//     const handleReserveButtonClick = async () => {
//         try {
//             const response = await axios.post('http://localhost:8080/reserve', { userId: 'USER_ID' });
//             setIsInQueue(true);
//             console.log(response.data);
//         } catch (error) {
//             console.error('Error making reservation request:', error);
//         }
//     };

//     return (
//         <div>
//             <button onClick={handleReserveButtonClick}>Reserve</button>
//             {isInQueue && (
//                 <div>
//                     <h2>Waiting in Queue</h2>
//                     <p>Your current position: {queuePosition}</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ReservationPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const ReservationPage = () => {
    const [queuePosition, setQueuePosition] = useState(null);
    const [isInQueue, setIsInQueue] = useState(false);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        if (isInQueue && !stompClient) {
            const socket = new SockJS('http://localhost:8080/ws');
            const client = Stomp.over(socket);

            client.connect({}, (frame) => {
                console.log('Connected: ' + frame);
                client.subscribe('/topic/waitingQueue', (message) => {
                    const data = JSON.parse(message.body);
                    console.log("data=",data);
                    
                    setQueuePosition(data);
                    if (data === 1) {
                        if (stompClient) {
                            stompClient.disconnect();
                        }
                        handleReservation();
                    }
                });
            });

            console.log('WebSocket 연결 완료');
            setStompClient(client);
        }
        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, [isInQueue, stompClient]);

    const handleReservation = async () => {
        try {
            console.log("예약 요청 가능");
        } catch (error) {
            console.error('Error making reservation:', error);
        }
    };

    const handleReserveButtonClick = async () => {
        try {
            const response = await axios.post('http://localhost:8080/reserve', { userId: 'USER_ID' });
            setIsInQueue(true);
                } catch (error) {
            console.error('Error making reservation request:', error);
        }
    };

    return (
        <div>
            <button onClick={handleReserveButtonClick}>Reserve</button>
            {isInQueue && (
                <div>
                    <h2>Waiting in Queue</h2>
                    <p>Your current position: {queuePosition}</p>
                </div>
            )}
        </div>
    );
};

export default ReservationPage;
