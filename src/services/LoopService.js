class LoopService {
  static loop(interval, callback) {
    return setInterval(() => {
      callback()
    }, interval)
  }
  
  static stop(loop) {
    clearInterval(loop)
  }
}

export default LoopService