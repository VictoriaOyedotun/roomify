-- Seed matchmaking questions (run after schema creation)
INSERT INTO match_questions (question_text, category, question_type, options_json, weight) VALUES
('How would you describe your cleanliness standards?', 'cleanliness', 'SINGLE_CHOICE', '["Very tidy - I like everything in place","Generally tidy","Relaxed - a bit of mess is fine","I don''t mind clutter"]', 1.5),
('What is your typical sleep schedule?', 'sleep', 'SINGLE_CHOICE', '["Early bird (asleep by 10pm)","Normal (11pm-12am)","Night owl (after midnight)","Irregular / shift work"]', 1.2),
('How do you feel about having guests over?', 'guests', 'SINGLE_CHOICE', '["Frequently - friends and family welcome","Sometimes - with notice","Rarely - prefer quiet space","Never - no guests"]', 1.0),
('Do you have or want pets?', 'pets', 'SINGLE_CHOICE', '["I have pets / want to have pets","Open to pets with discussion","Prefer no pets","Allergic or strongly no pets"]', 1.5),
('How important is quiet time at home?', 'noise', 'SINGLE_CHOICE', '["Very - I need a lot of quiet","Moderate - some noise is ok","I like background noise / music","I don''t mind noise"]', 1.0),
('Smoking policy?', 'lifestyle', 'SINGLE_CHOICE', '["Non-smoker only","Ok outside only","Flexible","Smoker"]', 1.5),
('How do you prefer to split shared expenses?', 'budget', 'SINGLE_CHOICE', '["Split everything 50/50","Split rent only, own groceries","Keep shared costs minimal","Flexible - we can discuss"]', 1.0),
('How often do you cook at home?', 'habits', 'SINGLE_CHOICE', '["Almost every day","Several times a week","Rarely","Never - eat out or order"]', 0.8);
