module.exports = function findBy(collection, prop, value, options) {
  const arr = Array.isArray(collection) ? collection : [];
  const val = value != null ? String(value) : '';
  const item = arr.find(it => it && String(it[prop]) === val);
  if (options && typeof options.fn === 'function') {
    return item ? options.fn(item) : options.inverse(this);
  }
  return item || null;
};
