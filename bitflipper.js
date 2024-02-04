function execute(code) {
    let lines = code.match(/^[^\n]+/gm) //divide into lines

    //remove the comments
    for (let l = 0; l < lines.length; l++) {
        lines[l] = (lines[l].match(/^[^#]+/) || [""])[0]
    }

    //compile the program
    let compiled = []
    
    for (pc = 0; pc < lines.length; pc++) {
        const cmd = lines[pc].slice(0, 4).toUpperCase()
        /*
        none = 0
        flip = 1
        skip = 2
        jump = 3
        otpt = 4
        inpt = 5
        debg = 6
        */
        compiled[pc] = [
            ( cmd == "FLIP" ? 1
            : cmd == "SKIP" ? 2
            : cmd == "JUMP" ? 3
            : cmd == "OTPT" ? 4
            : cmd == "INPT" ? 5
            : cmd == "DEBG" ? 6 //for bitflipper code debugging purposes
            : 0),
            parseInt(lines[pc].slice(5))
        ]
    }
    
    //execute
    let mem = []
    let out = ""
    
    for (let pc = 0; (pc >= 0) && (pc < compiled.length) ; pc++) {
        const cmd = compiled[pc][0]
        const val = compiled[pc][1]

        switch (cmd) {
            case 1: //FLIP
                mem[val] = (!mem[val] ? true : false)
                break
            case 2: //SKIP
                pc += mem[val] || false
                break
            case 3: //JUMP
                pc = val - 1
                break
            case 4: //OTPT
                function bitAt(location) {
                    return 0+(mem[location] || false)
                }
                //get the byte at val
                let byte = ""
                for (let bit = val; bit < val + 8; bit++) {
                    byte += bitAt(bit)
                }
                out += String.fromCharCode(parseInt(byte, 2))
                break
            case 5: //INPT
                let byte_ = ((prompt("Input Byte ").charCodeAt(0) || 0) % 256).toString(2) //take a byte of input and turn it into binary byte

                //fill to 8 bits
                while (byte_.length < 8) {
                    byte_ = "0" + byte_
                }

                //set memory
                for (let i = 0; i < 8; i++) {
                    mem[val + i] = (byte_[i] == "1" ? true : false)
                }
                break
            case 6:
                console.log(mem, pc)
        }
    }
    return out
}