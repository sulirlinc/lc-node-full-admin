const logger = require("../logger");
const { Q, dao } = require("../common");

module.exports = (() => {
  return {
    async getUserByUserNameAndPassword({ userName, password }) {
      const client = await dao.client();
      logger.info(`Login:user_name=${ userName }`);
      return (
          await client.query({
            sql: "select count(1)>0 c from t_user where user_name=$1 and password=$2",
            queryConfig: [ userName, password ]
          })
      ).rows[0].c;
    },

    async addUser({ userName, password }) {
      const client = await dao.client();
      logger.info(`Register:user_name=${ userName }`);
      await client.query({
            sql: "insert into t_user (user_name,password) VALUES ($1,$2)",
            queryConfig: [ userName, password ]
          }
      );
    },

    async findUser({ userName }) {
      const client = await dao.client();
      return (
          await client.query({
            sql: "select * from t_user where user_name=$1",
            queryConfig: [ userName ]
          })
      ).rows[0];
    },

    async findUserInfo({ limit, offset, allSearch }) {
      const client = await dao.client();
      let sqlWhere = "t_user";
      const values = [];
      if (!Q.isNullOrEmpty(allSearch)) {
        values.push(`%${ allSearch }%`);
        const index = values.length;
        sqlWhere = `${ sqlWhere } where (user_name like $${ index } or phone like $${ index } or e_mail like $${ index } or address like $${ index } or operate_user like $${ index })`;
      }
      const length = values.length;
      logger.info("findUserInfo");
      const rows = (
          await client.query(
              {
                sql: `select user_id,user_name,phone,e_mail,address,user_type,create_time,modify_time,operate_user from ${ sqlWhere } order by coalesce( modify_time,create_time) desc LIMIT $${ length
                +
                1 } OFFSET $${ length + 2 }`,
                queryConfig: values.concat([ limit, offset ])
              }
          )
      ).rows;
      const count = parseInt(
          (await client.query({
            sql: `select count(1) c from ${ sqlWhere }`, queryConfig: values
          }))
              .rows[0].c
      );
      return { rows, count };
    },

    async saveUserInfo({
      user_id,
      user_name,
      password,
      phone,
      e_mail,
      user_type,
      address,
      operate_user
    }) {
      const client = await dao.client();
      if (!user_id) {
        logger.info("insertUserInfo");
        await client.query(
            {
              sql: `insert into t_user (user_name,password,phone,
                e_mail,
                user_type,
                  address,create_time,operate_user) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
              queryConfig: [
                user_name,
                password,
                phone,
                e_mail,
                user_type,
                address,
                Q.now(),
                operate_user
              ]
            }
        );
      } else {
        logger.info("updateUserInfo");
        await client.query({
              sql: "update t_user set user_name=$1,phone=$2,e_mail=$3,user_type=$4,address=$5,modify_time=$6,operate_user=$7 where user_id=$8",
              queryConfig: [
                user_name,
                phone,
                e_mail,
                user_type,
                address,
                Q.now(),
                operate_user,
                user_id
              ]
            }
        );
      }
    },
    async removeUserInfo({ user_id }) {
      const client = await dao.client();
      logger.info("deleteUserInfo");
      await client.query({
        sql: "delete from t_user where user_id=$1", queryConfig: [ user_id ]
      });
    }
  };
})();
