module.exports  = class SmartPlug {
    constructor(socketCount){
        this.socketCount = socketCount
        this.interval = Math.random() * 10 + 5
        this.turnedOnSocket = new Array(this.socketCount).fill(false) 
        this._current = 0.1 // this is for calculating power
        this.voltage_state = new Array(this.socketCount).fill(-1) 
    }

    getVoltage() {
        for (let i = 0; i < this.socketCount; i++) {
            if(this.turnedOnSocket[i] && this.voltage_state[i] !== -1)
            {
                this.voltage_state[i] = (Math.random() * 20 + 230) 
                this.turnedOnSocket[i] = false
            } else if(this.voltage_state[i] !== -1){
                this.voltage_state[i] = (Math.random() * 20 + 200) 
            }
            else{
                this.voltage_state[i] = -1 
            }

        }
        this.turnedOnSocket = new Array(this.socketCount).fill(false) 

        return this.voltage_state;
    }

    getPower() {
        return this.voltage_state.map((elem) => {
            if (elem !== -1)
                return elem * this._current
            else
                return -1
            })
    
        }

    getTotalPower(){
        var total = this.getPower().filter((e) => {return e !== -1})
        
        if (!Array.isArray(total) || !total.length) {
            return 0
          
        }
        
        return total.reduce((elem, acu) => {
                return elem + acu;
        })
    }
    changeState(socket){
        this.voltage_state[socket-1] = this.voltage_state[socket-1] >= 0 ? -1:0//(state == 'ON'? 0 : -1 )
        this.turnedOnSocket[socket-1] = true
    }

}

