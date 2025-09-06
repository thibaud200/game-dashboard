-- Sample data for Board Game Score Tracker
-- This file populates the database with sample data for testing

-- =====================================================
-- SAMPLE PLAYERS
-- =====================================================

INSERT INTO players (player_name, email, avatar, favorite_game, created_at) VALUES
('Jane', 'jane@example.com', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', 'Strategy Pro', '2024-01-15 10:00:00'),
('Nexus', 'nexus@example.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', 'Battle Arena', '2024-02-02 14:30:00'),
('Maya', 'maya@example.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', 'Mind Games', '2024-01-28 09:15:00'),
('Alex', 'alex@example.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', 'Strategy Pro', '2024-02-10 16:45:00'),
('Sam', 'sam@example.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', 'Cosmic Empire', '2024-02-15 11:20:00'),
('Riley', 'riley@example.com', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', 'Battle Arena', '2024-01-20 13:00:00');

-- =====================================================
-- SAMPLE GAMES
-- =====================================================

INSERT INTO games (
    bgg_id, name, description, image, min_players, max_players, duration, difficulty, category,
    year_published, publisher, designer, bgg_rating, weight, age_min, game_type,
    supports_cooperative, supports_competitive, supports_campaign, has_expansion, has_characters,
    created_at
) VALUES
(12345, 'Strategy Pro', 'A complex strategy game that challenges your tactical thinking.', 
 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
 2, 4, '60-90 min', 'Expert', 'Strategy', 2022, 'Strategy Games Inc.', 'John Designer',
 7.8, 3.5, 14, 'competitive', FALSE, TRUE, TRUE, FALSE, TRUE, '2024-01-01 12:00:00'),

(23456, 'Battle Arena', 'Fast-paced combat game with multiple character classes.',
 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop',
 3, 6, '45-60 min', 'Intermediate', 'Combat', 2023, 'Combat Games Ltd.', 'Sarah Designer',
 7.2, 2.8, 12, 'competitive', FALSE, TRUE, TRUE, TRUE, TRUE, '2024-01-15 10:30:00'),

(34567, 'Mind Games', 'Psychological warfare meets board game mechanics.',
 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=150&h=150&fit=crop',
 2, 8, '30-45 min', 'Beginner', 'Party', 2021, 'Mind Works', 'Alex Mindmaker',
 6.9, 1.5, 10, 'competitive', FALSE, TRUE, FALSE, FALSE, FALSE, '2024-02-01 15:00:00'),

(45678, 'Cosmic Empire', 'Build your galactic empire across the stars.',
 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop',
 2, 5, '90-120 min', 'Expert', 'Strategy', 2020, 'Cosmic Games', 'Maria Cosmos',
 8.1, 4.2, 16, 'competitive', FALSE, TRUE, TRUE, TRUE, TRUE, '2024-01-20 11:00:00'),

(56789, 'Mystic Quest', 'Cooperative adventure through mystical realms.',
 'https://images.unsplash.com/photo-1578662015016-2a4ac6ba8bf4?w=150&h=150&fit=crop',
 1, 4, '60-90 min', 'Intermediate', 'Adventure', 2023, 'Mystic Studios', 'Elena Mystic',
 7.5, 2.9, 12, 'cooperative', TRUE, FALSE, TRUE, TRUE, TRUE, '2024-02-05 14:20:00'),

(67890, 'Racing Legends', 'High-speed racing with customizable vehicles.',
 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop',
 2, 6, '45-75 min', 'Intermediate', 'Racing', 2022, 'Speed Games', 'Carlos Racer',
 7.0, 2.3, 10, 'competitive', FALSE, TRUE, FALSE, FALSE, FALSE, '2024-01-25 09:45:00'),

(78901, 'Kingdom Builder', 'Build and expand your medieval kingdom.',
 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop',
 2, 4, '60-90 min', 'Expert', 'Strategy', 2021, 'Kingdom Games', 'Robert Builder',
 7.9, 3.8, 14, 'competitive', FALSE, TRUE, TRUE, TRUE, TRUE, '2024-01-10 16:30:00'),

(89012, 'Space Explorers', 'Discover new worlds in this cooperative space adventure.',
 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=150&h=150&fit=crop',
 1, 5, '75-120 min', 'Expert', 'Adventure', 2024, 'Cosmic Adventures', 'Lisa Explorer',
 8.0, 3.9, 14, 'cooperative', TRUE, FALSE, TRUE, FALSE, TRUE, '2024-02-12 13:15:00');

-- =====================================================
-- SAMPLE GAME EXPANSIONS
-- =====================================================

INSERT INTO game_expansions (game_id, bgg_expansion_id, name, year_published, description) VALUES
-- Battle Arena expansions
(2, 67890, 'Battle Arena: New Warriors', 2024, 'Adds 4 new character classes and new battlefields'),
(2, 67891, 'Battle Arena: Ancient Powers', 2024, 'Introduces magical abilities and ancient artifacts'),

-- Cosmic Empire expansions  
(4, 45678, 'Cosmic Empire: Alien Worlds', 2021, 'Explore new alien civilizations and technologies'),
(4, 45679, 'Cosmic Empire: Deep Space', 2022, 'Venture into the unknown regions of space'),
(4, 45680, 'Cosmic Empire: Galactic War', 2023, 'Large-scale warfare expansion with new ship types'),

-- Mystic Quest expansions
(5, 56790, 'Mystic Quest: Shadow Realms', 2024, 'Dark expansion with new enemies and locations'),

-- Kingdom Builder expansions
(7, 78902, 'Kingdom Builder: Royal Expansion', 2022, 'Adds royal court mechanics and nobility system'),
(7, 78903, 'Kingdom Builder: Trade Routes', 2023, 'Introduces commerce and trading mechanics');

-- =====================================================
-- SAMPLE GAME CHARACTERS
-- =====================================================

INSERT INTO game_characters (game_id, character_key, name, description, abilities) VALUES
-- Strategy Pro characters
(1, 'commander', 'Commander', 'Strategic military leader', '["Battle Tactics", "Resource Management", "Unit Command"]'),
(1, 'diplomat', 'Diplomat', 'Skilled negotiator and alliance builder', '["Trade Negotiations", "Alliance Formation", "Information Gathering"]'),

-- Battle Arena characters
(2, 'warrior', 'Warrior', 'Fierce melee fighter', '["Heavy Attack", "Shield Block", "Intimidate"]'),
(2, 'archer', 'Archer', 'Precise ranged combatant', '["Long Shot", "Multi-Shot", "Eagle Eye"]'),
(2, 'mage', 'Mage', 'Master of magical arts', '["Fireball", "Heal", "Teleport"]'),
(2, 'rogue', 'Rogue', 'Stealthy assassin', '["Stealth Attack", "Poison Blade", "Evasion"]'),

-- Cosmic Empire characters
(4, 'explorer', 'Explorer', 'Galactic scout and pioneer', '["System Discovery", "Resource Scanning", "Jump Drive"]'),
(4, 'diplomat', 'Diplomat', 'Inter-species negotiator', '["Trade Agreements", "Alliance Formation", "Cultural Exchange"]'),
(4, 'admiral', 'Admiral', 'Fleet commander', '["Fleet Command", "Battle Tactics", "Ship Design"]'),

-- Mystic Quest characters
(5, 'wizard', 'Wizard', 'Master of arcane magic', '["Arcane Missile", "Teleport", "Summon Familiar"]'),
(5, 'ranger', 'Ranger', 'Nature guardian and tracker', '["Track Monster", "Animal Companion", "Bow Mastery"]'),
(5, 'cleric', 'Cleric', 'Divine healer and protector', '["Heal Wounds", "Divine Shield", "Turn Undead"]'),
(5, 'rogue', 'Rogue', 'Master thief and scout', '["Lockpicking", "Stealth", "Backstab"]'),

-- Kingdom Builder characters
(7, 'king', 'King', 'Ruler of the realm', '["Royal Decree", "Tax Collection", "Military Command"]'),
(7, 'merchant', 'Merchant', 'Master of trade and commerce', '["Trade Routes", "Market Influence", "Resource Trading"]'),
(7, 'general', 'General', 'Military strategist', '["Battle Planning", "Troop Training", "Siege Warfare"]'),

-- Space Explorers characters
(8, 'captain', 'Captain', 'Ship commander and leader', '["Leadership", "Navigation", "Crisis Management"]'),
(8, 'scientist', 'Scientist', 'Research specialist', '["Research", "Analysis", "Technology Development"]'),
(8, 'engineer', 'Engineer', 'Technical expert', '["Repair", "Modify Equipment", "System Override"]'),
(8, 'pilot', 'Pilot', 'Expert spacecraft operator', '["Precision Flying", "Evasive Maneuvers", "System Knowledge"]');

-- =====================================================
-- SAMPLE GAME SESSIONS
-- =====================================================

INSERT INTO game_sessions (game_id, session_date, duration_minutes, winner_player_id, session_type, notes) VALUES
-- Strategy Pro sessions
(1, '2024-03-01 19:00:00', 75, 1, 'competitive', 'Intense strategic battle, Jane dominated the late game'),
(1, '2024-03-05 20:30:00', 90, 4, 'competitive', 'Alex pulled off an amazing comeback victory'),
(1, '2024-03-10 18:00:00', 85, 2, 'competitive', 'Close game, decided by final turn resources'),

-- Battle Arena sessions
(2, '2024-03-02 19:30:00', 60, 2, 'competitive', 'Epic warrior vs archer showdown'),
(2, '2024-03-07 21:00:00', 45, 6, 'competitive', 'Riley mastered the new mage character'),
(2, '2024-03-12 19:15:00', 55, 1, 'competitive', 'Jane adapted quickly to rogue tactics'),

-- Mind Games sessions
(3, '2024-03-03 20:00:00', 35, 3, 'competitive', 'Maya''s psychological warfare paid off'),
(3, '2024-03-08 19:45:00', 40, 5, 'competitive', 'Sam surprised everyone with bold moves'),

-- Cosmic Empire sessions
(4, '2024-03-04 18:30:00', 120, 5, 'competitive', 'Epic space empire clash, Sam built the best trade routes'),
(4, '2024-03-09 17:00:00', 105, 1, 'competitive', 'Jane''s diplomatic strategy dominated'),

-- Mystic Quest cooperative sessions
(5, '2024-03-06 20:00:00', 85, NULL, 'cooperative', 'Team victory! Everyone worked together perfectly'),
(5, '2024-03-11 19:30:00', 95, NULL, 'cooperative', 'Close call but managed to defeat the final boss');

-- =====================================================
-- SAMPLE SESSION PLAYERS
-- =====================================================

INSERT INTO session_players (session_id, player_id, character_id, score, placement, is_winner, notes) VALUES
-- Session 1: Strategy Pro (Jane wins)
(1, 1, 1, 95, 1, TRUE, 'Excellent late-game resource management'),
(1, 2, 2, 78, 2, FALSE, 'Strong diplomatic play but fell short'),
(1, 4, 1, 65, 3, FALSE, 'Good early game but struggled mid-game'),

-- Session 2: Strategy Pro (Alex wins)
(2, 4, 2, 88, 1, TRUE, 'Amazing comeback with diplomatic victory'),
(2, 1, 1, 85, 2, FALSE, 'Led most of the game but Alex caught up'),
(2, 3, 1, 72, 3, FALSE, 'Solid play throughout'),

-- Session 3: Strategy Pro (Nexus wins)
(3, 2, 1, 92, 1, TRUE, 'Perfect military strategy execution'),
(3, 5, 2, 80, 2, FALSE, 'Great diplomatic moves'),
(3, 6, 1, 68, 3, FALSE, 'Learning the game mechanics'),

-- Session 4: Battle Arena (Nexus wins)
(4, 2, 4, 120, 1, TRUE, 'Dominated with warrior tactics'),
(4, 1, 5, 105, 2, FALSE, 'Strong archer play'),
(4, 3, 6, 85, 3, FALSE, 'Effective mage spells'),

-- Session 5: Battle Arena (Riley wins)
(5, 6, 6, 135, 1, TRUE, 'Mastered the mage character perfectly'),
(5, 4, 4, 110, 2, FALSE, 'Good warrior performance'),
(5, 5, 5, 95, 3, FALSE, 'Decent archer tactics'),

-- Session 6: Battle Arena (Jane wins)
(6, 1, 7, 125, 1, TRUE, 'Excellent rogue stealth tactics'),
(6, 2, 4, 115, 2, FALSE, 'Strong warrior performance'),
(6, 6, 6, 100, 3, FALSE, 'Good mage support'),

-- Session 7: Mind Games (Maya wins)
(7, 3, NULL, 85, 1, TRUE, 'Brilliant psychological manipulation'),
(7, 1, NULL, 72, 2, FALSE, 'Good strategy but outplayed'),
(7, 4, NULL, 68, 3, FALSE, 'Solid performance'),
(7, 2, NULL, 55, 4, FALSE, 'Struggled with the mind games'),

-- Session 8: Mind Games (Sam wins)
(8, 5, NULL, 90, 1, TRUE, 'Surprising bold strategy worked perfectly'),
(8, 6, NULL, 78, 2, FALSE, 'Consistent play throughout'),
(8, 3, NULL, 75, 3, FALSE, 'Good adaptation to Sam''s moves'),

-- Session 9: Cosmic Empire (Sam wins)
(9, 5, 7, 180, 1, TRUE, 'Built incredible trade network'),
(9, 1, 8, 165, 2, FALSE, 'Strong diplomatic empire'),
(9, 2, 9, 145, 3, FALSE, 'Good military strategy'),
(9, 4, 7, 120, 4, FALSE, 'Learning the complex mechanics'),

-- Session 10: Cosmic Empire (Jane wins)
(10, 1, 8, 195, 1, TRUE, 'Diplomatic mastery led to victory'),
(10, 3, 7, 170, 2, FALSE, 'Excellent exploration strategy'),
(10, 5, 9, 155, 3, FALSE, 'Strong military presence'),

-- Session 11: Mystic Quest cooperative (Team victory)
(11, 1, 10, 85, 1, FALSE, 'Excellent wizard spellcasting'),
(11, 2, 11, 90, 1, FALSE, 'Perfect ranger tracking and support'),
(11, 3, 12, 88, 1, FALSE, 'Crucial healing kept team alive'),
(11, 4, 13, 82, 1, FALSE, 'Rogue skills opened many paths'),

-- Session 12: Mystic Quest cooperative (Team victory)
(12, 2, 11, 92, 1, FALSE, 'Rangers animal companion was key'),
(12, 5, 10, 89, 1, FALSE, 'Powerful wizard magic'),
(12, 6, 12, 87, 1, FALSE, 'Divine healing saved the day'),
(12, 1, 13, 85, 1, FALSE, 'Stealth tactics were perfect');