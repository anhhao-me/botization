module.exports = (bots, report) => bot => {
  bot.updatedAt = new Date();

  return report(bots.map(bot => ({
    name: bot.name,
    state: bot.state,
    createdAt: bot.createdAt,
    updatedAt: bot.updatedAt
  })));
}