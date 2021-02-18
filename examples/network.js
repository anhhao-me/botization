(async () => {
  const res = await get('https://example.com');
  log(res.body);
})();