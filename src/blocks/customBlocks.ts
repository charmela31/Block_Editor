import * as Blockly from 'blockly';
import { Block } from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';

export function defineBlocks() {
  // 1. Set Variable Block
  Blockly.Blocks['set_variable'] = {
    init: function() {
      this.appendValueInput('VALUE')
          .setCheck(null)
          .appendField('set variable')
          .appendField(new Blockly.FieldTextInput('name'), 'VAR_NAME')
          .appendField('to');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(330);
      this.setTooltip('Set a variable to a value');
      this.setHelpUrl('');
    }
  };

  javascriptGenerator['set_variable'] = function(block: Block) {
    const varName = block.getFieldValue('VAR_NAME');
    const value = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ASSIGNMENT) || '0';
    return `let ${varName} = ${value};\n`;
  };

  // Get Variable Block
  Blockly.Blocks['variables_get'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('get variable')
          .appendField(new Blockly.FieldTextInput('name'), 'VAR_NAME');
      this.setOutput(true, null);
      this.setColour(330);
      this.setTooltip('Get the value of a variable');
      this.setHelpUrl('');
    }
  };

  javascriptGenerator['variables_get'] = function(block: Block) {
    const varName = block.getFieldValue('VAR_NAME');
    return [varName, javascriptGenerator.ORDER_ATOMIC];
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
        code = `${a} === ${b}`;
        break;
      case 'NEQ':
        code = `${a} !== ${b}`;
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
}