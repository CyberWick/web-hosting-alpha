export const schema = {
    title: 'Notifications',
    type: 'object',
    required: ['_id'],
    properties: {
      _id: {
        type: 'string'
      },
      name: {
        type: 'string',
      },
      member: {
        type: 'array',
        items: {
          type: 'object',
          required: ['pubKey', 'role', 'email'],
          properties: {
            pubKey: {
              type: 'string',
            },
            role: {
              type: 'integer'
            },
            email: {
              type: 'string'
            },
          },
        },
      },
      messages: {
        type: 'array',
        items: {
          type: 'string',
        }
      }
    },
  };

export const writeValidator = (writer, event, instance) => {
    var type = event.patch.type;
    var patch = event.patch.json_patch;
    var index = -1;
    var i;
    if(type === 'create') {
        return true;
    }
    for(i=0; i<instance.member.length; i++) {
      if(instance.member[i].pubKey === writer) {
        index = i;
        break;
      }
    }
    if(index === -1) {
      return false;
    }
    switch (type) {
      case 'delete': 
        if(instance.member[index].role === 3) {
          return true;
        } else {
          return false;
        }
      case 'save': 
        if(instance.member[index].role >= 2) {
          return true;
        } else {
          return false;
        }
      default: 
        return true;
    }
  }

export const readFilter = (reader, instance) => {
    var index = -1;//instance.member.findIndex(item => item.pubKey === reader);
    var i;
    for(i=0; i < instance.member.length; i++) {
      if(instance.member[i].pubKey === reader) {
        index = i;
        break;
      }
    }
    if(index === -1) {
      delete instance.member;
      delete instance.messages;
    } 
    return instance;
  }