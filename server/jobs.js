const jobs = {
  add: {
    plugins: [ 'jobLock' ],
    pluginOptions: {
      jobLock: {}
    },
    perform: (a, b, callback) => {
      setTimeout(() => {
        const answer = a + b;
        callback(null, answer);
      }, 1000);
    }
  },
  subtract: {
    perform: (a, b, callback) => {
      const answer = a - b;
      callback(null, answer);
    }
  }
};

export default jobs;
