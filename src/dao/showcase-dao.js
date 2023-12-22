const { Q, dao } = require("../common")
module.exports = (() => {
  return {
    async save({ id, userName, showData, dataType, operatorId }) {
      const client = await dao.client();
      if (!id) {
        await client.query({
          sql: "insert into t_showcase (operator_id,user_name,show_data,data_type,create_at) VALUES ($1,$2,$3,$4,$5)",
          queryConfig: [ operatorId, userName, showData, dataType, Q.now() ]
        });
      } else {
        await client.query({
          sql: "update t_showcase set operator_id=$1, user_name=$2,show_data=$3,data_type=$4,update_at=$5 where id=$6",
          queryConfig: [ operatorId, userName, showData, dataType, Q.now(), id ]
        });
      }
    },
    async remove({ id }) {
      const client = await dao.client();
      await client.query({
        sql: "update t_showcase set is_delete=true, update_at=$1 where id=$2",
        queryConfig: [ Q.now(), id ]
      });
    },
    async find({ startAt, endAt, allSearch, limit, offset }) {
      const client = await dao.client();
      let sqlWhere = "t_showcase where (is_delete=false or is_delete is null)";
      const values = []
      if (!Q.isNullOrEmpty(startAt)) {
        values.push(startAt)
        const index = values.length
        sqlWhere = `${ sqlWhere } and create_at >= $${ index }`
      }
      if (!Q.isNullOrEmpty(endAt)) {
        values.push(endAt)
        const index = values.length
        sqlWhere = `${ sqlWhere } and create_at < $${ index }`
      }
      if (!Q.isNullOrEmpty(allSearch)) {
        values.push(`%${ allSearch }%`)
        const index = values.length
        sqlWhere = `${ sqlWhere } and (user_name like $${ index } or show_data like $${ index })`
      }
      const length = values.length;
      const rows = (
          await client.query(
              {
                sql: `select * from ${ sqlWhere } order by create_at desc LIMIT $${ length
                + 1 } OFFSET $${ length + 2 }`,
                queryConfig: values.concat([ limit, offset ])
              }
          )
      ).rows;
      const count = parseInt(
          (await client.query({
            sql: `select count(1) c from ${ sqlWhere }`,
            queryConfig: values
          })).rows[0].c
      );
      return { rows, count };
    }
  };
})();
