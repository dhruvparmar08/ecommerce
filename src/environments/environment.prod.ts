import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  secret_key: "AaBb0CcDd1EeFf2GgHh3IiJj4KkLl5MmNn6OoPp7QqRr8SsTt9UuVvWwXxYyZz",
  api_url: "http://localhost:8080/api",
  image_url: "http://localhost:8080/upload",
  timeoutDuration: 30000,
  default_img: "http://localhost:8080/profiles/1712566856572.png"
};
