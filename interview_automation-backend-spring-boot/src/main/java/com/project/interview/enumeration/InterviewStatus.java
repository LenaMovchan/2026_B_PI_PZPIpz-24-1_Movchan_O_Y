package com.project.interview.enumeration;

import com.project.interview.exception.StateTransitionException;
import java.util.EnumSet;
import java.util.Set;

public enum InterviewStatus {
    PLANNED,
    ACTIVE,
    FINISHED,
    COMPLETED,
    CANCELLED;
    private Set<InterviewStatus> validTransitions;

    static {
        PLANNED.validTransitions = EnumSet.of(ACTIVE, CANCELLED);
        ACTIVE.validTransitions = EnumSet.of(FINISHED, COMPLETED, CANCELLED);
        FINISHED.validTransitions = EnumSet.of(COMPLETED, CANCELLED);
        COMPLETED.validTransitions = EnumSet.noneOf(InterviewStatus.class);
        CANCELLED.validTransitions = EnumSet.noneOf(InterviewStatus.class);
    }

    public static void validateStatusTransition(InterviewStatus currentStatus, InterviewStatus newStatus) {
        if (!currentStatus.validTransitions.contains(newStatus)) {
            throw new StateTransitionException("Invalid status transition", currentStatus, newStatus);
        }
    }
}
