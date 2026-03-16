package com.roomify.dto;

import jakarta.validation.constraints.Size;

public class UpdateUserRequest {

    @Size(max = 100)
    private String displayName;

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
}
