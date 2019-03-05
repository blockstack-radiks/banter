import Model from 'radiks/lib/model';
import fromNow from 'fromnow';

export default class Message extends Model {
  static className = 'Message';

  static schema = {
    content: {
      type: String,
      decrypted: true,
    },
    createdBy: {
      type: String,
      decrypted: true,
    },
  };

  ago() {
    return fromNow(this.attrs.createdAt, { max: 1, suffix: true });
  }
}
