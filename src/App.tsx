import { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { Play, Trash2, Code } from 'lucide-react';
import { defineBlocks } from './blocks/customBlocks';
import { toolboxConfig } from './blocks/toolbox';

function App() {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [showCode, setShowCode] = useState<boolean>(true);

  // Initialize Blockly workspace
  useEffect(() => {
    if (blocklyDiv.current && !workspace) {
      // Define custom blocks
      defineBlocks();

      // Create workspace
      const newWorkspace = Blockly.inject(blocklyDiv.current, {
        toolbox: toolboxConfig,
        grid: {
          spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true,
        },
        zoom: {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
        },
        trashcan: true,
      });

      setWorkspace(newWorkspace);

      // Update code when blocks change
      newWorkspace.addChangeListener(() => {
        const code = javascriptGenerator.workspaceToCode(newWorkspace);
        setGeneratedCode(code);
      });

      // Handle window resize
      const handleResize = () => {
        if (blocklyDiv.current) {
          Blockly.svgResize(newWorkspace);
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
        newWorkspace.dispose();
      };
    }
  }, [blocklyDiv]);

  // Run the generated code
  const runCode = () => {
    if (!generatedCode) {
      setConsoleOutput(['No code to run.']);
      return;
    }

    setConsoleOutput([]);
    
    // Create a custom console.log function to capture output
    const originalConsoleLog = console.log;
    const outputs: string[] = [];
    
    console.log = (...args) => {
      const output = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      outputs.push(output);
      originalConsoleLog(...args);
    };

    try {
      // Add a wrapper to catch errors
      const executableCode = `
        try {
          ${generatedCode}
        } catch (error) {
          console.log('Error:', error.message);
        }
      `;
      
      // Execute the code
      // eslint-disable-next-line no-new-func
      new Function(executableCode)();
      
      setConsoleOutput(outputs.length ? outputs : ['Code executed successfully with no output.']);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setConsoleOutput([`Error executing code: ${message}`]);
    } finally {
      // Restore original console.log
      console.log = originalConsoleLog;
    }
  };

  // Reset the workspace
  const resetWorkspace = () => {
    if (workspace) {
      workspace.clear();
      setGeneratedCode('');
      setConsoleOutput(['Workspace cleared.']);
    }
  };

  // Toggle code visibility
  const toggleCodeVisibility = () => {
    setShowCode(!showCode);
  };


  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-pink-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blockly Code Editor</h1>
        <div className="flex space-x-2">
          <button 
            onClick={runCode}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
          >
            <Play className="mr-1" size={18} /> Run
          </button>
          <button 
            onClick={resetWorkspace}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
          >
            <Trash2 className="mr-1" size={18} /> Reset
          </button>
          <button 
            onClick={toggleCodeVisibility}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded flex items-center"
          >
            <Code className="mr-1" size={18} /> {showCode ? 'Hide Code' : 'Show Code'}
          </button>
          
         
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Blockly workspace */}
        <div 
          ref={blocklyDiv} 
          className="flex-1 h-full"
        ></div>

        {/* Code and console output */}
        <div className="w-1/3 bg-gray-900 text-white flex flex-col">
          {showCode && (
            <div className="flex-1 p-4 overflow-auto">
              <h2 className="text-xl font-semibold mb-2">Generated JavaScript</h2>
              <pre className="bg-gray-800 p-4 rounded h-full overflow-auto">
                {generatedCode || 'No code generated yet.'}
              </pre>
            </div>
          )}
          <div className={`${showCode ? 'h-1/3' : 'flex-1'} p-4 overflow-auto border-t border-gray-700`}>
            <h2 className="text-xl font-semibold mb-2">Console Output</h2>
            <div className="bg-black p-4 rounded h-full overflow-auto">
              {consoleOutput.length > 0 ? (
                consoleOutput.map((output, index) => (
                  <div key={index} className="text-green-400 font-mono">
                    {output}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic">No output yet. Run your code to see results here.</div>
              )}
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
}

export default App;