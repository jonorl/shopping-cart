const today = new Date()

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-UK',
    { weekday: 'long' }
  ).format(date);
}

function DisplayChocotorta() {
  const image = "/public/Chocotorta-24-500x500.jpg"
  return (
    <>
      <div className="container">
        <h1>Favourite Food</h1>
        <p>Today is {formatDate(today)}</p>
        <input type="number" />
        Something
        <li>Chocotorta</li>
        <img
          src={image}
          alt="Chocotorta cake image"
        />
      </div>
    </>
  );
}

export { DisplayChocotorta };
