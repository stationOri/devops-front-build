# 베이스 이미지 설정
FROM node:18-alpine

# 타임존 설정
ENV TZ=Asia/Seoul

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사 및 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 3000번 포트 노출
EXPOSE 3000

# npm start 스크립트 실행
CMD ["npm", "start"]