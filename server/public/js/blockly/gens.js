Blockly.JavaScript['time_sleep_input'] = function(block) {
  var number_sleepval = block.getFieldValue('sleepval');
  var code = 'sleep('+number_sleepval+');\n';
  return code;
};
Blockly.JavaScript['time_sleep_field'] = function(block) {
  var number_sleepval = block.getFieldValue('sleepval');
  var code = 'sleep('+number_sleepval+');\n';
  return code;
};
Blockly.JavaScript['output_green_led_field'] = function(block) {
  var checkbox_on = block.getFieldValue('on') == 'TRUE';
  // TODO: Assemble JavaScript into code variable.
  var code = 'green_led('+(checkbox_on?1:0)+');\n';
  return code;
};
