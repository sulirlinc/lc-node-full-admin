/**
 * 创建数据库系统表。
 */
const { omnipotentSingleCURDService } = require("../../src/services");
const commonFields = [
  {
    name: 'code',
    type: 'varchar',
    isNotNull: true
  }, {
    name: 'display',
    type: 'varchar',
    isNotNull: true
  }, {
    name: 'status',
    type: 'smallint',
    default: 1,
    isNotNull: true
  },
]
const systemTables = [
  {
    isAutoCreateId: true,
    isAutoCreateOperatorId: true,
    tableName: 't_s_mapping_curd_data',
    fields: commonFields.concat([ {
      name: 'tableName',
      type: 'varchar',
      isNotNull: true
    }, {
      name: 'primaryKey',
      type: 'varchar'
    }, {
      name: 'uniqueKeys',
      type: 'varchar'
    }, {
      name: 'hasOperatorId',
      type: 'smallint',
      default: 0
    },
    ]), uniqueKeys: [ 'code,tableName' ]
  }, {
    isAutoCreateId: true,
    isAutoCreateOperatorId: true,
    tableName: 't_u_search',
    fields: commonFields.concat([ {
      name: 'key',
      type: 'varchar',
      isNotNull: true
    }, {
      name: 'type',
      type: 'varchar',
      isNotNull: true
    }, {
      name: 'defaultValue',
      type: 'varchar'
    }
    ]), uniqueKeys: [ 'code,key' ]
  },

  {
    isAutoCreateId: true,
    tableName: 't_u_column',
    isAutoCreateOperatorId: true,
    fields: commonFields.concat([ {
      name: 'key',
      type: 'varchar',
      isNotNull: true
    }, {
      name: 'type',
      type: 'varchar',
      isNotNull: true
    }
    ]), uniqueKeys: [ 'code,key' ]
  },
  {
    isAutoCreateId: true,
    tableName: 't_u_form',
    isAutoCreateOperatorId: true,
    fields: commonFields.concat([ {
      name: 'key',
      type: 'varchar',
      isNotNull: true
    }, {
      name: 'type',
      type: 'varchar',
      isNotNull: true
    }, {
      name: 'defaultValue',
      type: 'varchar'
    }
    ]), uniqueKeys: [ 'code,key' ]
  }, {
    isAutoCreateId: true,
    tableName: 't_s_constants',
    isAutoCreateOperatorId: true,
    fields: [ {
      name: 'code',
      type: 'varchar',
      isNotNull: true
    }, {
      name: 'type',
      type: 'varchar',
      isNotNull: true
    }, {
      name: 'display',
      type: 'varchar',
      isNotNull: true
    }, {
      name: 'message',
      type: 'varchar',
      isNotNull: true
    }, {
      name: 'value',
      type: 'varchar',
      isNotNull: true
    }
    ], uniqueKeys: [ 'value' ]
  }
]

it('创建表', (done) => {
  [{
    isAutoCreateId: false,
    tableName: 't_user',
    isAutoCreateOperatorId: true,
    fields: [ {
      name: 'code',
      type: 'varchar',
      isNotNull: true
    }, {
      name: 'type',
      type: 'varchar',
      isNotNull: true
    },]
  }].concat(systemTables).map(data => omnipotentSingleCURDService.create({
    user: { user_id: 1 }, data
  }).then((data) => {
    console.log(data)
    done()
  }).catch(e => {
    console.error(e)
    done()
  }))
})
