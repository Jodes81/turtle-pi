
var hardware = 
{
    wpi: require('wiring-pi'),
    conf: null,
    setup: function(conf)
    {
        hardware.conf = conf;
        hardware.wpi.wiringPiSetup();
        hardware.wpi.pinMode(hardware.conf.LED_GREEN, hardware.wpi.OUTPUT);
        //wpi.digitalWrite(conf.LED_GREEN, 1);
        
        hardware.wpi.pinMode(hardware.conf.IR_SENSOR_LEFT, hardware.wpi.INPUT);
        hardware.wpi.pinMode(hardware.conf.IR_SENSOR_RIGHT, hardware.wpi.INPUT);
        
        hardware.wpi.pinMode(hardware.conf.WHEEL_LEFT_FORWARD, hardware.wpi.OUTPUT);
        hardware.wpi.pinMode(hardware.conf.WHEEL_LEFT_REVERSE, hardware.wpi.OUTPUT);
        hardware.wpi.pinMode(hardware.conf.WHEEL_RIGHT_FORWARD, hardware.wpi.OUTPUT);
        hardware.wpi.pinMode(hardware.conf.WHEEL_RIGHT_REVERSE, hardware.wpi.OUTPUT);
        
        hardware.wpi.digitalWrite(hardware.conf.WHEEL_LEFT_FORWARD, 0);
        hardware.wpi.digitalWrite(hardware.conf.WHEEL_LEFT_REVERSE, 0);
        hardware.wpi.digitalWrite(hardware.conf.WHEEL_RIGHT_FORWARD, 0);
        hardware.wpi.digitalWrite(hardware.conf.WHEEL_RIGHT_REVERSE, 0);
        
//        hardware.wpi.softPwmCreate(hardware.conf.WHEEL_LEFT_FORWARD, 25, 100);
    },
    parsePinValue: function(val){
        return (val==1 || val==true) ? 1 : 0; 
    },
    green_led: function(active)
    {
        active = hardware.parsePinValue(active);
//        console.log("Actual LED: " + active + "("+(typeof active)+")");
        hardware.wpi.digitalWrite(hardware.conf.LED_GREEN, active);
    },
    
};


module.exports = hardware;

