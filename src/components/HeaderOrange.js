import LogoOrange from "../assets/images/logo-orange.png"
import "../css/components/HeaderOrange.css"

function HeaderOrange() {
  
  return (
    <div className="orangeheaderWrapper">
      <img className="orangeheaderImg" src={LogoOrange} alt=""/>
    </div>
  );
}

export default HeaderOrange;
