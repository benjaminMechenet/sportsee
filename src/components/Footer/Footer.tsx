function Footer() {
  return (
    <footer className="px-10 py-2 bg-white d-flex flex-row justify-content-between">
      <div className="d-flex flex-row gap-2">
        <div>©Sportsee</div>
        <div>Tous droits réservés</div>
      </div>
      <div className="d-flex flex-row gap-4 w-25 justify-content-end">
        <div>Conditions générales</div>
        <div>Contact</div>
        <img className="d-block" src="/favicon.svg" />
      </div>
    </footer>
  );
}

export default Footer;
