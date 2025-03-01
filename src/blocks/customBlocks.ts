import * as Blockly from 'blockly';
import { Block } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

export function defineBlocks() {
  // Custom Set Variable Block
  Blockly.Blocks['custom_set_variable'] = {
    init: function() {
      this.appendValueInput('VALUE')
          .setCheck(null)
          .appendField('set')
          .appendField(new Blockly.FieldVariable('item'), 'VAR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(330);
      this.setTooltip('Set a variable to a value');
      this.setHelpUrl('');
    }
  };

  javascriptGenerator['custom_set_variable'] = function(block: Block) {
    const varName = block.getFieldValue('VAR');
    const value = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ASSIGNMENT) || '0';
    return `let ${varName} = ${value};\n`;
  };

  // Variables Change Block
  Blockly.Blocks['variables_change'] = {
    init: function() {
      this.appendValueInput('DELTA')
          .setCheck('Number')
          .appendField('change')
          .appendField(new Blockly.FieldVariable('item'), 'VAR')
          .appendField('by');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(330);
      this.setTooltip('Change a variable by a value');
      this.setHelpUrl('');
    }
  };

  javascriptGenerator['variables_change'] = function(block: Block) {
    const varName = block.getFieldValue('VAR');
    const delta = javascriptGenerator.valueToCode(block, 'DELTA', javascriptGenerator.ORDER_ADDITION) || '0';
    
    // If delta is 1, use i++ syntax
    if (delta === '1') {
      return `${varName}++;\n`;
    } else {
      return `${varName} = ${varName} + ${delta};\n`;
    }
  };

  // Global Variable Declaration
  Blockly.Blocks['variables_global'] = {
    init: function() {
      this.appendValueInput('VALUE')
          .setCheck(null)
          .appendField('global variable')
          .appendField(new Blockly.FieldVariable('item'), 'VAR')
          .appendField('=');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(330);
      this.setTooltip('Declare a global variable');
      this.setHelpUrl('');
    }
  };

  javascriptGenerator['variables_global'] = function(block: Block) {
    const varName = block.getFieldValue('VAR');
    const value = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ASSIGNMENT) || '0';
    return `window.${varName} = ${value};\n`;
  };

  // Increment Block
  Blockly.Blocks['increment_variable'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('increment')
          .appendField(new Blockly.FieldVariable('item'), 'VAR');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(330);
      this.setTooltip('Increment a variable by 1');
      this.setHelpUrl('');
    }
  };

  javascriptGenerator['increment_variable'] = function(block: Block) {
    const varName = block.getFieldValue('VAR');
    return `${varName}++;\n`;
  };

  // 2. Arithmetic Operations Block
  Blockly.Blocks['arithmetic_operation'] = {
    init: function() {
      this.appendValueInput('A')
          .setCheck(null);
      this.appendValueInput('B')
          .setCheck(null)
          .appendField(new Blockly.FieldDropdown([
            ['+', 'ADD'],
            ['-', 'SUBTRACT'],
            ['×', 'MULTIPLY'],
            ['÷', 'DIVIDE']
          ]), 'OPERATION');
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setPreviousStatement(false, null);
      this.setNextStatement(false, null);
      this.setColour(230);
      this.setTooltip('Perform arithmetic operations');
      this.setHelpUrl('');
    }
  };

  javascriptGenerator['arithmetic_operation'] = function(block: Block) {
    const operation = block.getFieldValue('OPERATION');
    const a = javascriptGenerator.valueToCode(block, 'A', javascriptGenerator.ORDER_ATOMIC) || '0';
    const b = javascriptGenerator.valueToCode(block, 'B', javascriptGenerator.ORDER_ATOMIC) || '0';
    
    let code;
    switch (operation) {
      case 'ADD':
        code = `${a} + ${b}`;
        break;
      case 'SUBTRACT':
        code = `${a} - ${b}`;
        break;
      case 'MULTIPLY':
        code = `${a} * ${b}`;
        break;
      case 'DIVIDE':
        code = `${a} / ${b}`;
        break;
      default:
        code = '0';
    }
    
    return [code, javascriptGenerator.ORDER_ATOMIC];
  };

  // 3. Print Output Block
  Blockly.Blocks['print_output'] = {
    init: function() {
      this.appendValueInput('TEXT')
          .setCheck(null)
          .appendField('print');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip('Print to the console');
      this.setHelpUrl('');
    }
  };

  javascriptGenerator['print_output'] = function(block: Block) {
    const text = javascriptGenerator.valueToCode(block, 'TEXT', javascriptGenerator.ORDER_NONE) || "''";
    return `console.log(${text});\n`;
  };

  // 4. Conditional Block (If-Else)
  Blockly.Blocks['conditional_block'] = {
    init: function() {
      this.appendValueInput('CONDITION')
          .setCheck('Boolean')
          .appendField('if');
      this.appendStatementInput('DO')
          .setCheck(null)
          .appendField('do');
      this.appendStatementInput('ELSE')
          .setCheck(null)
          .appendField('else');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(210);
      this.setTooltip('If-else conditional statement');
      this.setHelpUrl('');
    }
  };

  javascriptGenerator['conditional_block'] = function(block: Block) {
    const condition = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_NONE) || 'false';
    const doCode = javascriptGenerator.statementToCode(block, 'DO') || '';
    const elseCode = javascriptGenerator.statementToCode(block, 'ELSE') || '';
    
    return `if (${condition}) {\n${doCode}} else {\n${elseCode}}\n`;
  };

  // Text block
  Blockly.Blocks['text'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('"')
          .appendField(new Blockly.FieldTextInput(''), 'TEXT')
          .appendField('"');
      this.setOutput(true, 'String');
      this.setColour(160);
      this.setTooltip('A text string');
      this.setHelpUrl('');
    }
  };

  javascriptGenerator['text'] = function(block: Block) {
    const text = block.getFieldValue('TEXT');
    return [`"${text}"`, javascriptGenerator.ORDER_ATOMIC];
  };

  // Number block
  Blockly.Blocks['math_number'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldNumber(0), 'NUM');
      this.setOutput(true, 'Number');
      this.setColour(230);
      this.setTooltip('A number');
      this.setHelpUrl('');
    }
  };

  javascriptGenerator['math_number'] = function(block: Block) {
    const number = parseFloat(block.getFieldValue('NUM'));
    return [number, javascriptGenerator.ORDER_ATOMIC];
  };

  // Logic compare block
  Blockly.Blocks['logic_compare'] = {
    init: function() {
      this.appendValueInput('A')
          .setCheck(null);
      this.appendValueInput('B')
          .setCheck(null)
          .appendField(new Blockly.FieldDropdown([
            ['=', 'EQ'],
            ['≠', 'NEQ'],
            ['<', 'LT'],
            ['≤', 'LTE'],
            ['>', 'GT'],
            ['≥', 'GTE']
          ]), 'OP');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour(210);
      this.setTooltip('Compare two values');
      this.setHelpUrl('');
    }
  };

  javascriptGenerator['logic_compare'] = function(block: Block) {
    const operator = block.getFieldValue('OP');
    const a = javascriptGenerator.valueToCode(block, 'A', javascriptGenerator.ORDER_RELATIONAL) || '0';
    const b = javascriptGenerator.valueToCode(block, 'B', javascriptGenerator.ORDER_RELATIONAL) || '0';
    
    let code;
    switch (operator) {
      case 'EQ':
        code = `${a} == ${b}`;
        break;
      case 'NEQ':
        code = `${a} != ${b}`;
        break;
      case 'LT':
        code = `${a} < ${b}`;
        break;
      case 'LTE':
        code = `${a} <= ${b}`;
        break;
      case 'GT':
        code = `${a} > ${b}`;
        break;
      case 'GTE':
        code = `${a} >= ${b}`;
        break;
      default:
        code = 'false';
    }
    
    return [code, javascriptGenerator.ORDER_RELATIONAL];
  };

  // Logic boolean block
  Blockly.Blocks['logic_boolean'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ['true', 'TRUE'],
            ['false', 'FALSE']
          ]), 'BOOL');
      this.setOutput(true, 'Boolean');
      this.setColour(210);
      this.setTooltip('Boolean value (true/false)');
      this.setHelpUrl('');
    }
  };

  javascriptGenerator['logic_boolean'] = function(block: Block) {
    const code = block.getFieldValue('BOOL') === 'TRUE' ? 'true' : 'false';
    return [code, javascriptGenerator.ORDER_ATOMIC];
  };

  // Logic operation block (AND, OR)
  Blockly.Blocks['logic_operation'] = {
    init: function() {
      this.appendValueInput('A')
          .setCheck('Boolean');
      this.appendValueInput('B')
          .setCheck('Boolean')
          .appendField(new Blockly.FieldDropdown([
            ['and', 'AND'],
            ['or', 'OR']
          ]), 'OP');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour(210);
      this.setTooltip('Logic operations (AND, OR)');
      this.setHelpUrl('');
    }
  };

  javascriptGenerator['logic_operation'] = function(block: Block) {
    const operator = block.getFieldValue('OP');
    const a = javascriptGenerator.valueToCode(block, 'A', javascriptGenerator.ORDER_LOGICAL_AND) || 'false';
    const b = javascriptGenerator.valueToCode(block, 'B', javascriptGenerator.ORDER_LOGICAL_AND) || 'false';
    
    let code;
    if (operator === 'AND') {
      code = `${a} && ${b}`;
      return [code, javascriptGenerator.ORDER_LOGICAL_AND];
    } else {
      code = `${a} || ${b}`;
      return [code, javascriptGenerator.ORDER_LOGICAL_OR];
    }
  };

  // Alert block
  Blockly.Blocks['alert_block'] = {
    init: function() {
      this.appendValueInput('MESSAGE')
          .setCheck(null)
          .appendField('alert');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip('Show an alert message');
      this.setHelpUrl('');
    }
  };

  javascriptGenerator['alert_block'] = function(block: Block) {
    const message = javascriptGenerator.valueToCode(block, 'MESSAGE', javascriptGenerator.ORDER_NONE) || "''";
    return `alert(${message});\n`;
  };

  // Input prompt block
  Blockly.Blocks['input_prompt'] = {
    init: function() {
      this.appendValueInput('MESSAGE')
          .setCheck(null)
          .appendField('prompt');
      this.setOutput(true, null);
      this.setColour(160);
      this.setTooltip('Get user input with a prompt');
      this.setHelpUrl('');
    }
  };

  javascriptGenerator['input_prompt'] = function(block: Block) {
    const message = javascriptGenerator.valueToCode(block, 'MESSAGE', javascriptGenerator.ORDER_NONE) || "''";
    return [`prompt(${message})`, javascriptGenerator.ORDER_FUNCTION_CALL];
  };
}