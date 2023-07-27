export const randRange = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
export const mapN = function (n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};