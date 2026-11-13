// Skill levels and safety rule defaults.



export const LEVEL_WEIGHT = { self: 10, demonstrated: 40, institution: 70, client: 100, platform: 100 };

export const LEVEL_ORDER = ['self', 'demonstrated', 'institution', 'client', 'platform'];

export const DEFAULT_RULES = { chat: true, calls: true, time: true, photo: true, hours: true };

export const RULE_KEYS = ['chat', 'calls', 'time', 'photo', 'hours'];
