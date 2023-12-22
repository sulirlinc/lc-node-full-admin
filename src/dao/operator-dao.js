const logger = require("../logger");
const { dao }  = require('../common')

module.exports = (() => {
  return {
    async findOperatorData({ startAt, endAt, limit, offset }) {
      const client = await dao.client();
      const sqlWhere =
        "t_operator_data where create_at >=$1 and create_at < $2";
      logger.info(`findOperatorData:startAt=${startAt},endAt=${endAt}`);
      const rows = (
        await client.query({
          sql: `select * from ${sqlWhere} order by create_at LIMIT $3 OFFSET $4`,
          queryConfig: [startAt, endAt, limit, offset]
        }
        )
      ).rows;
      const count = parseInt(
        (
          await client.query({
            sql: `select count(1) c from ${sqlWhere}`, queryConfig: [
              startAt,
              endAt
            ]
          })
        ).rows[0].c
      );
      return { rows, count };
    }
  };
})();
