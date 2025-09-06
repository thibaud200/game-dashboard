#!/usr/bin/env node

// Simple test script to check if backend is working
const http = require('http');

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
  console.log('🔍 Testing backend connectivity...\n');

  // Test 1: Health Check
  try {
    console.log('1. Testing health endpoint...');
    const health = await makeRequest('/api/health');
    if (health.status === 200) {
      console.log('   ✅ Health check OK:', health.data);
    } else {
      console.log('   ❌ Health check failed:', health.status);
    }
  } catch (error) {
    console.log('   ❌ Health check error:', error.message);
  }

  // Test 2: Players endpoint
  try {
    console.log('\n2. Testing players endpoint...');
    const players = await makeRequest('/api/players');
    if (players.status === 200) {
      console.log(`   ✅ Players endpoint OK: ${players.data.length} players found`);
      if (players.data.length > 0) {
        console.log('   📋 Sample player:', JSON.stringify(players.data[0], null, 2));
      }
    } else {
      console.log('   ❌ Players endpoint failed:', players.status);
    }
  } catch (error) {
    console.log('   ❌ Players endpoint error:', error.message);
  }

  // Test 3: Games endpoint
  try {
    console.log('\n3. Testing games endpoint...');
    const games = await makeRequest('/api/games');
    if (games.status === 200) {
      console.log(`   ✅ Games endpoint OK: ${games.data.length} games found`);
      if (games.data.length > 0) {
        console.log('   🎮 Sample game:', JSON.stringify(games.data[0], null, 2));
      }
    } else {
      console.log('   ❌ Games endpoint failed:', games.status);
    }
  } catch (error) {
    console.log('   ❌ Games endpoint error:', error.message);
  }

  // Test 4: Stats endpoints
  try {
    console.log('\n4. Testing stats endpoints...');
    const playerStats = await makeRequest('/api/stats/players');
    const gameStats = await makeRequest('/api/stats/games');
    
    if (playerStats.status === 200 && gameStats.status === 200) {
      console.log('   ✅ Stats endpoints OK');
      console.log('   📊 Player stats:', JSON.stringify(playerStats.data, null, 2));
      console.log('   📊 Game stats:', JSON.stringify(gameStats.data, null, 2));
    } else {
      console.log('   ❌ Stats endpoints failed');
    }
  } catch (error) {
    console.log('   ❌ Stats endpoints error:', error.message);
  }

  console.log('\n🏁 Backend test completed!');
}

// Run if this is the main module
if (require.main === module) {
  testBackend().catch(console.error);
}

module.exports = { testBackend, makeRequest };