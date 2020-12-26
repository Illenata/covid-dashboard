const month = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'];
let array = [];
array = array.map((el) => {
  if (el === '1/1/20') {
    return month[0];
  }
  if (el === '2/1/20') {
    return month[1];
  }
  if (el === '3/1/20') {
    return month[2];
  }
  if (el === '4/1/20') {
    return month[3];
  }
  if (el === '5/1/20') {
    return month[4];
  }
  if (el === '6/1/20') {
    return month[5];
  }
  if (el === '7/1/20') {
    return month[6];
  }
  if (el === '8/1/20') {
    return month[7];
  }
  if (el === '9/1/20') {
    return month[8];
  }
  if (el === '10/1/20') {
    return month[9];
  }
  if (el === '11/1/20') {
    return month[10];
  }
  if (el === '12/1/20') {
    return month[11];
  }
  return el;
});
console.log(array);
