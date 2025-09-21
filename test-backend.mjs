#!/usr/bin/env node

// Simple test script to check if backend is working
import http from 'http';

const API_BASE_URL = 'http://localhost:3001';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function testBackend() {
  process.stdout.write('🔍 Testing backend connectivity...\n\n');

  // Test 1: Health Check
  try {
    process.stdout.write('1. Testing health endpoint...\n');
    const health = await makeRequest('/api/health');
    if (health.status === 200) {
      process.stdout.write('   ✅ Health check OK: ' + JSON.stringify(health.data) + '\n');
    } else {
      process.stdout.write('   ❌ Health check failed: ' + health.status + '\n');
    }
  } catch (error) {
    process.stdout.write('   ❌ Health check error: ' + error.message + '\n');
  }

  // Test 2: Players endpoint
  try {
    process.stdout.write('\n2. Testing players endpoint...\n');
    const players = await makeRequest('/api/players');
    if (players.status === 200) {
      process.stdout.write(`   ✅ Players endpoint OK: ${players.data.length} players found\n`);
      if (players.data.length > 0) {
        process.stdout.write('   📋 Sample player: ' + JSON.stringify(players.data[0], null, 2) + '\n');
      }
    } else {
      process.stdout.write('   ❌ Players endpoint failed: ' + players.status + '\n');
    }
  } catch (error) {
    process.stdout.write('   ❌ Players endpoint error: ' + error.message + '\n');
  }

  // Test 3: Games endpoint
  try {
    process.stdout.write('\n3. Testing games endpoint...\n');
    const games = await makeRequest('/api/games');
    if (games.status === 200) {
      process.stdout.write(`   ✅ Games endpoint OK: ${games.data.length} games found\n`);
      if (games.data.length > 0) {
        process.stdout.write('   🎮 Sample game: ' + JSON.stringify(games.data[0], null, 2) + '\n');
      }
    } else {
      process.stdout.write('   ❌ Games endpoint failed: ' + games.status + '\n');
    }
  } catch (error) {
    process.stdout.write('   ❌ Games endpoint error: ' + error.message + '\n');
  }

  // Test 4: Stats endpoints
  try {
    process.stdout.write('\n4. Testing stats endpoints...\n');
    const playerStats = await makeRequest('/api/stats/players');
    const gameStats = await makeRequest('/api/stats/games');
    
    if (playerStats.status === 200 && gameStats.status === 200) {
      process.stdout.write('   ✅ Stats endpoints OK\n');
      process.stdout.write('   📊 Player stats: ' + JSON.stringify(playerStats.data, null, 2) + '\n');
      process.stdout.write('   📊 Game stats: ' + JSON.stringify(gameStats.data, null, 2) + '\n');
    } else {
      process.stdout.write('   ❌ Stats endpoints failed\n');
    }
  } catch (error) {
    process.stdout.write('   ❌ Stats endpoints error: ' + error.message + '\n');
  }

  process.stdout.write('\n🏁 Backend test completed!\n');
}

// Run the test
testBackend().catch((error) => {
  process.stderr.write('Test failed: ' + error.message + '\n');
  process.exit(1);
});

export { testBackend, makeRequest };