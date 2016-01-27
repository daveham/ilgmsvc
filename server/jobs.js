const jobs = {
  add: {
    plugins: [ 'jobLock' ],
    pluginOptions: {
      jobLock: {}
    },
    perform: (a, b, callback) => {
      setTimeout(() => {
        callback(null, a + b);
      }, 1000);
    }
  },
  subtract: {
    perform: (a, b, callback) => {
      callback(null, a - b);
    }
  }
};

export default jobs;
