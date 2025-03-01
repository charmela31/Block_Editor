export const toolboxConfig = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Logic',
      colour: '#5C81A6',
      contents: [
        { kind: 'block', type: 'conditional_block' },
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_boolean' },
        { kind: 'block', type: 'controls_if' }
      ]
    },
    {
      kind: 'category',
      name: 'Loops',
      colour: '#5CA65C',
      contents: [
        { kind: 'block', type: 'controls_repeat' },
        { kind: 'block', type: 'controls_whileUntil' },
        { kind: 'block', type: 'controls_for' },
        { kind: 'block', type: 'controls_forEach' }
      ]
    },
    {
      kind: 'category',
      name: 'Math',
      colour: '#5C68A6',
      contents: [
        { kind: 'block', type: 'arithmetic_operation' },
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_round' },
        { kind: 'block', type: 'math_single' },
        { kind: 'block', type: 'math_trig' },
        { kind: 'block', type: 'math_random_int' }
      ]
    },
    {
      kind: 'category',
      name: 'Text',
      colour: '#A65C81',
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_join' },
        { kind: 'block', type: 'text_length' },
        { kind: 'block', type: 'text_indexOf' },
        { kind: 'block', type: 'text_charAt' }
      ]
    },
    {
      kind: 'category',
      name: 'Variables',
      custom: 'VARIABLE',
      colour: '#A6745C',
      contents: [
        { kind: 'block', type: 'custom_set_variable' }, 
        { kind: 'block', type: 'variables_get' },
        { kind: 'block', type: 'variables_change' },
        { kind: 'block', type: 'variables_global' }
      ]
    },
    {
      kind: 'category',
      name: 'Custom',
      colour: '#745CA6',
      contents: [
        { kind: 'block', type: 'print_output' },
        { kind: 'block', type: 'input_prompt' },
        { kind: 'block', type: 'alert_block' },
      ]
    }
    
  ]
};