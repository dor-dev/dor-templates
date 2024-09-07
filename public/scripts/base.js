function shuffleArray(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {

    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

function shortenNumber(number) {
  const myNumber = Number(number);

  if (myNumber > 1000000) {
    return Math.ceil(myNumber / 1000000) + " M";
  }
  if (myNumber > 1000) {
    return Math.ceil(myNumber / 1000) + " K";
  }
  if (myNumber === 0) {
    return 0;
  }
  return myNumber.toLocaleString("es-ES", {
    maximumFractionDigits: 2, 
    minimumFractionDigits: 2, 
  });
}

function formatNumber(number) {
  const myNumber = Number(number);

  return myNumber.toLocaleString("es-ES", {

  });
}