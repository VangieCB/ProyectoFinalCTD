import "../styles/Footer.css";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from "react-share";

const Footer = () => {
  const shareUrl = window.location.origin;
  const quoteText =
    "Descubre #FindU y disfruta de los mejores eventos en línea, compra tus entradas desde la comodidad de tu hogar..\n" +
    "Ingresa a nuestra Web";

  return (
    <footer className="footer">
      <div className="footer-left">
        <img src="/FindUcopy.svg" alt="logocopy" />
      </div>

      <div className="footer-right">
        <FacebookShareButton url={shareUrl} quote={quoteText} hashtag={'#FindU'}>
          <img src="/la_facebook.svg" alt="Compartir en Facebook" />
        </FacebookShareButton>

        <TwitterShareButton url={shareUrl} title={quoteText}>
          <img src="/ri_twitter-x-fill.svg" alt="Compartir en Twitter" />
        </TwitterShareButton>

        <LinkedinShareButton url={shareUrl} title={quoteText}>
          <img src="/lin.svg" alt="Compartir en linkedin" />
        </LinkedinShareButton>

        <WhatsappShareButton url={shareUrl} title={quoteText} separator={'\n'}>
          <img src="/wp.svg" alt="Compartir en wp" />
        </WhatsappShareButton>
      </div>
    </footer>
  );
};

export default Footer;
