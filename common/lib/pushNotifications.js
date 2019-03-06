// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const checkWindowPermission = async () => {
  const permission = await window.Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification');
  } else return true;
};

const subscribeUser = async (registration) => {
  console.log(registration);
  /**
   * TODO: generate keys
   * npm install -g web-push
   * web-push generate-vapid-keys
   * https://medium.com/izettle-engineering/beginners-guide-to-web-push-notifications-using-service-workers-cb3474a17679
   */
  // const applicationServerKey = urlB64ToUint8Array(
  //   'BJ5IxJBWdeqFDJTvrZ4wNRu7UY2XigDXjgiUBYEYVXDudxhEs0ReOJRBcBHsPYgZ5dyV8VjyqzbQKS8V7bUAglk'
  // );
  try {
    // const subscription = await registration.pushManager.subscribe({
    //   userVisibleOnly: true,
    //   applicationServerKey: applicationServerKey,
    // });
    // console.log('User is subscribed.');
    // console.log(subscription);
    // updateSubscriptionOnServer(subscription);
    // return subscription;
    return registration;
  } catch (err) {
    console.log('Failed to subscribe the user: ', err);
    return null;
  }
};

const init = async (registration) => {
  // Set the initial subscription value
  const permission = await checkWindowPermission();
  if (!permission) return;
  const subscription = await registration.pushManager.getSubscription();
  const isSubscribed = subscription !== null;

  if (isSubscribed) {
    console.log('User IS subscribed.');
  } else {
    console.log('User is NOT subscribed.');
    await subscribeUser(registration);
  }
};

export { init, urlB64ToUint8Array };
