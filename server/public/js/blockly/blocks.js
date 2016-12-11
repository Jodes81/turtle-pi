Blockly.Blocks['string_length'] = {
  init: function() {
    this.jsonInit({
      "message0": 'length of %1',
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE",
          "check": "String"
        }
      ],
      "output": "Number",
      "colour": 160,
      "tooltip": "Returns number of letters in the provided text.",
      "helpUrl": "http://www.w3schools.com/jsref/jsref_length_string.asp"
    });
  }
};
Blockly.Blocks['time_sleep_input'] = {
  init: function() {
    this.jsonInit({
      "type": "time_sleep_input",
      "message0": "sleep %1",
      "args0": [
        {
          "type": "input_value",
          "name": "sleepval",
          "check": "Number"
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": 300,
      "tooltip": "",
      "helpUrl": "http://www.example.com/"
    });
  }
};
Blockly.Blocks['time_sleep_field'] = {
  init: function() {
    this.jsonInit({
      "type": "time_sleep_field",
      "message0": "sleep %1",
      "args0": [
        {
          "type": "field_number",
          "name": "sleepval",
          "value": 2,
          "min": 0.001
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": 300,
      "tooltip": "",
      "helpUrl": "http://www.example.com/"
    });
  }
};

Blockly.Blocks['output_green_led_field'] = {
  init: function() {
    this.jsonInit({
    "type": "output_green_led_field",
      "message0": "Green LED %1",
      "args0": [
        {
          "type": "field_checkbox",
          "name": "on",
          "checked": true
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 0,
      "tooltip": "",
      "helpUrl": "http://www.example.com/"
    });
  }
};



