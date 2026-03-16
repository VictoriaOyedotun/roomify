package com.roomify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SendMessageRequest {

    @NotBlank(message = "Message body is required")
    @Size(max = 4000)
    private String body;

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
}
