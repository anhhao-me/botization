schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * * *', async () => {
  const res = await get('https://example.com');
  log(res.status);
});
