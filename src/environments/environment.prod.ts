import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  secret_key: "AaBb0CcDd1EeFf2GgHh3IiJj4KkLl5MmNn6OoPp7QqRr8SsTt9UuVvWwXxYyZz",
  api_url: "https://authentication-2tpq.onrender.com/api",
  image_url: "https://authentication-2tpq.onrender.com/upload",
  timeoutDuration: 30000,
  default_img: "https://authentication-2tpq.onrender.com/profiles/1712566856572.png"
};
