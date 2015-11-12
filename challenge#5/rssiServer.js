var SerialPort = require("serialport");
var app = require('express')();
var xbee_api = require('xbee-api');

var C = xbee_api.constants;
var XBeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});

var portName = process.argv[2];

var sampleDelay = 3000;

var app = require('express')();
var express=require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var trainningSet = [[56,54,49], 
[49,55,51], 
[46,37,41], 
[47,40,49], 
[49,50,35], 
[43,48,31], 
[41,55,40], 
[45,45,45], 
[45,45,37], 
[46,42,35], 
[41,42,34], 
[38,50,34], 
[45,38,48], 
[45,43,48], 
[50,42,51], 
[45,42,46], 
[38,48,51], 
[47,39,50], 
[43,42,44], 
[55,51,49], 
[43,42,45], 
[50,52,43], 
[43,37,46], 
[45,46,41], 
[45,44,50], 
[42,40,43], 
[48,45,42], 
[40,47,46], 
[53,45,40], 
[45,41,39], 
[40,45,47], 
[39,44,50], 
[38,48,41], 
[39,41,46], 
[42,48,48], 
[38,49,46], 
[39,50,40], 
[37,44,43], 
[39,48,45], 
[43,45,48], 
[37,39,48], 
[39,37,51], 
[41,44,47], 
[37,44,48], 
[45,48,50], 
[40,42,47], 
[39,35,40], 
[50,37,53], 
[31,54,69], 
[41,42,57], 
[42,48,52], 
[41,46,54], 
[45,33,49], 
[45,31,50]]
var predictions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54]

app.use('/fonts', express.static(__dirname + 'webpage/fonts'));
app.use('/images', express.static(__dirname + '/webpage/images'));
app.use('/', express.static(__dirname + '/webpage'));


app.get('/localization', function(req, res){
  res.sendfile('webpage/index.html');
});





//Note that with the XBeeAPI parser, the serialport's "data" event will not fire when messages are received!
portConfig = {
  baudRate: 9600,
  parser: XBeeAPI.rawParser()
};

http.listen(3000, function(){
  //listen on localhost port 3000
  console.log('listening on *:3000');
});


var sp;
sp = new SerialPort.SerialPort(portName, portConfig);


//Create a packet to be sent to all other XBEE units on the PAN.
// The value of 'data' is meaningless, for now.
var RSSIRequestPacket = {
  type: C.FRAME_TYPE.ZIGBEE_TRANSMIT_REQUEST,
  destination64: "000000000000ffff",
  broadcastRadius: 0x01,
  options: 0x00,
  data: "test"
}

var requestRSSI = function(){
  sp.write(XBeeAPI.buildFrame(RSSIRequestPacket));
}

sp.on("open", function () {
  console.log('open');
  requestRSSI();
  setInterval(requestRSSI, sampleDelay);
});

XBeeAPI.on("frame_object", function(frame) {
  if (frame.type == 144){
    console.log("Beacon ID: " + frame.data[1] + ", RSSI: " + (frame.data[0]));
  }
});