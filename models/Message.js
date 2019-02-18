import Model from 'radiks/lib/model';
import getConfig from 'next/config';
import moment from 'moment';

const { publicRuntimeConfig } = getConfig();

export default class Message extends Model {
  static config = publicRuntimeConfig.radiks

  static schema = {
    content: {
      type: String,
      decrypted: true,
    },
  }

  ago() {
    return moment(this.attrs.createdAt).fromNow();
  }
}
