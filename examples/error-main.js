schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * * *', () => {
  throw new Error('Schedule task');
});

throw new Error('Hello World');