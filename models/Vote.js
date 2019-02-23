import { Model } from 'radiks';

export default class Vote extends Model {
  static className = 'Vote';

  static schema = {
    messageId: {
      type: String,
      decrypted: true,
    },
    username: {
      type: String,
      decrypted: true,
    }
  }
};
