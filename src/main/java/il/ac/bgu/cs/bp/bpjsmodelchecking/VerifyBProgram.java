package il.ac.bgu.cs.bp.bpjsmodelchecking;

import il.ac.bgu.cs.bp.bpjs.analysis.ArrayExecutionTrace;
import il.ac.bgu.cs.bp.bpjs.analysis.DfsBProgramVerifier;
import il.ac.bgu.cs.bp.bpjs.analysis.VerificationResult;
import il.ac.bgu.cs.bp.bpjs.analysis.listeners.PrintDfsVerifierListener;
import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.PrintBProgramRunnerListener;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.ResourceBProgram;


public class VerifyBProgram {
    
    public static void main(String[] args) throws Exception {
//        final BProgram bprog = new ResourceBProgram("ttt.js");
//
//        BProgramRunner rnr = new BProgramRunner(bprog);
//
//        // Print program events to the console
//        rnr.addListener( new PrintBProgramRunnerListener() );
//
//        // go!
//        rnr.run();
        System.gc();
        long beforeUsedMem=Runtime.getRuntime().totalMemory()-Runtime.getRuntime().freeMemory();
        final BProgram bprog = new ResourceBProgram("dining_philosophers.js");
        DfsBProgramVerifier vfr = new DfsBProgramVerifier();
        vfr.setDebugMode(true);
        vfr.setProgressListener(new PrintDfsVerifierListener());
        VerificationResult res = vfr.verify(bprog);

        System.out.println(res.isViolationFound());  // true iff a counter example was found
        System.out.println(res.getViolation());      // an Optional<Violation>
        if (res.isViolationFound()){
            ArrayExecutionTrace trace = (ArrayExecutionTrace) res.getViolation().get().getCounterExampleTrace();
            System.out.println(trace);
        }
        System.gc();
        long afterUsedMem=Runtime.getRuntime().totalMemory()-Runtime.getRuntime().freeMemory();
        long actualMemUsed=afterUsedMem-beforeUsedMem;
        System.out.println("Amount of used memory: " + actualMemUsed);

    }
    
}
