package com.salarymanagement;

import org.junit.platform.launcher.Launcher;
import org.junit.platform.launcher.LauncherDiscoveryRequest;
import org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder;
import org.junit.platform.launcher.core.LauncherFactory;
import org.junit.platform.launcher.listeners.SummaryGeneratingListener;
import org.junit.platform.launcher.listeners.TestExecutionSummary;

import static org.junit.platform.engine.discovery.DiscoverySelectors.selectPackage;

public class TestRunner {
    public static void main(String[] args) {
        LauncherDiscoveryRequest request = LauncherDiscoveryRequestBuilder.request()
                .selectors(selectPackage("com.salarymanagement"))
                .build();

        Launcher launcher = LauncherFactory.create();
        SummaryGeneratingListener listener = new SummaryGeneratingListener();
        launcher.registerTestExecutionListeners(listener);

        System.out.println("\n========================================================");
        System.out.println("        COMPPULSE ENTERPRISE UNIT TEST SUITE            ");
        System.out.println("========================================================");

        launcher.execute(request);

        TestExecutionSummary summary = listener.getSummary();
        System.out.println("\n--------------------------------------------------------");
        System.out.printf("  Tests Discovered : %d%n", summary.getTestsFoundCount());
        System.out.printf("  Tests Started    : %d%n", summary.getTestsStartedCount());
        System.out.printf("  Tests Succeeded  : %d%n", summary.getTestsSucceededCount());
        System.out.printf("  Tests Failed     : %d%n", summary.getTestsFailedCount());
        System.out.printf("  Tests Skipped    : %d%n", summary.getTestsSkippedCount());
        System.out.println("--------------------------------------------------------");

        if (!summary.getFailures().isEmpty()) {
            System.err.println("\n>>> TEST FAILURES DETECTED <<<");
            for (TestExecutionSummary.Failure failure : summary.getFailures()) {
                System.err.printf("• [%s] in %s%n",
                        failure.getTestIdentifier().getDisplayName(),
                        failure.getException().getClass().getSimpleName());
                System.err.printf("  Error: %s%n", failure.getException().getMessage());
            }
            System.exit(1);
        } else {
            System.out.println("  RESULT: ALL UNIT TESTS PASSED SUCCESSFULLY! ✓\n");
            System.exit(0);
        }
    }
}
