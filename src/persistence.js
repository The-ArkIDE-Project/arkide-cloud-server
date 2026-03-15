const fs = require('fs');
const path = require('path');

const SAVE_FILE = path.join(__dirname, '../data/cloud-vars.json');
const SAVE_INTERVAL = 1000 * 30; // save every 30 seconds

function load() {
  try {
    if (fs.existsSync(SAVE_FILE)) {
      const data = JSON.parse(fs.readFileSync(SAVE_FILE, 'utf8'));
      console.log('Loaded persisted cloud vars from disk');
      return data;
    }
  } catch (e) {
    console.error('Failed to load persisted cloud vars:', e);
  }
  return {};
}

function save(rooms) {
  try {
    fs.mkdirSync(path.dirname(SAVE_FILE), { recursive: true });
    const data = {};
    for (const [id, room] of rooms.entries()) {
      const vars = {};
      room.getAllVariables().forEach((value, name) => {
        vars[name] = value;
      });
      // don't bother saving empty rooms
      if (Object.keys(vars).length > 0) {
        data[id] = vars;
      }
    }
    fs.writeFileSync(SAVE_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to persist cloud vars:', e);
  }
}

module.exports = { load, save, SAVE_INTERVAL };