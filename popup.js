
/* popup.js */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initNavigation();
    initTasksView();
    initModal();
    initSphere();
    initInsightsView();
  });
  
  // Navigation system
  function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');
    
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetView = btn.dataset.view;
        
        // Update active button
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show target view with animation
        views.forEach(view => {
          if (view.classList.contains(`view-${targetView}`)) {
            view.classList.add('active');
          } else {
            view.classList.remove('active');
          }
        });
      });
    });
  }
  
  // Tasks management
  function initTasksView() {
    const tasksList = document.getElementById('tasks-list');
    const addTaskBtn = document.getElementById('add-task');
    
    // Sample tasks data
    const tasks = [
      {
        id: 1,
        name: 'Research time management techniques',
        description: 'Find and compare different approaches to time management.',
        time: 45,
        priority: 'high',
        relations: [2, 3]
      },
      {
        id: 2,
        name: 'Implement Pomodoro timer feature',
        description: 'Add a Pomodoro timer to help users focus during work sessions.',
        time: 90,
        priority: 'medium',
        relations: [1]
      },
      {
        id: 3,
        name: 'Design onboarding screens',
        description: 'Create initial onboarding experience for new users.',
        time: 60,
        priority: 'low',
        relations: []
      }
    ];
    
    // Render tasks
    renderTasks(tasks);
    
    // Add task button click handler
    addTaskBtn.addEventListener('click', () => {
      openTaskModal();
    });
    
    function renderTasks(tasks) {
      tasksList.innerHTML = '';
      
      tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.priority}-priority`;
        taskElement.dataset.id = task.id;
        
        taskElement.innerHTML = `
          <div class="task-header">
            <div class="task-title">${task.name}</div>
            <div class="task-time">${task.time} min</div>
          </div>
          <div class="task-description">${task.description}</div>
          <div class="task-footer">
            <div class="task-relations">
              ${task.relations.map(() => `<div class="task-relation"></div>`).join('')}
            </div>
            <div class="task-actions">
              <button class="task-action-btn edit-task" data-id="${task.id}">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
              <button class="task-action-btn delete-task" data-id="${task.id}">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </button>
            </div>
          </div>
        `;
        
        tasksList.appendChild(taskElement);
      });
      
      // Add event listeners for task actions
      document.querySelectorAll('.edit-task').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const taskId = parseInt(btn.dataset.id);
          const task = tasks.find(t => t.id === taskId);
          if (task) {
            openTaskModal(task);
          }
        });
      });
      
      document.querySelectorAll('.delete-task').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const taskId = parseInt(btn.dataset.id);
          // Implementation for delete functionality would go here
          console.log(`Delete task ${taskId}`);
        });
      });
      
      // Add click event on task items
      document.querySelectorAll('.task-item').forEach(item => {
        item.addEventListener('click', () => {
          const taskId = parseInt(item.dataset.id);
          console.log(`View task details ${taskId}`);
          // Implementation for viewing task details
        });
      });
    }
  }
  
  // Modal management
  function initModal() {
    const modal = document.getElementById('task-modal');
    const cancelBtn = document.getElementById('cancel-task');
    const taskForm = document.getElementById('task-form');
    
    cancelBtn.addEventListener('click', () => {
      closeTaskModal();
    });
    
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Implementation for saving task
      console.log('Save task');
      closeTaskModal();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeTaskModal();
      }
    });
  }
  
  function openTaskModal(task = null) {
    const modal = document.getElementById('task-modal');
    const modalTitle = document.getElementById('modal-title');
    const taskNameInput = document.getElementById('task-name');
    const taskDescriptionInput = document.getElementById('task-description');
    const taskTimeInput = document.getElementById('task-time');
    const taskPrioritySelect = document.getElementById('task-priority');
    
    if (task) {
      modalTitle.textContent = 'Edit Task';
      taskNameInput.value = task.name;
      taskDescriptionInput.value = task.description;
      taskTimeInput.value = task.time;
      taskPrioritySelect.value = task.priority;
    } else {
      modalTitle.textContent = 'New Task';
      taskForm.reset();
    }
    
    modal.classList.add('active');
  }
  
  function closeTaskModal() {
    const modal = document.getElementById('task-modal');
    modal.classList.remove('active');
  }
  
  // 3D Sphere Visualization
  function initSphere() {
    let scene, camera, renderer, sphere;
    let nodes = [];
    let mouseX = 0, mouseY = 0;
    
    const container = document.getElementById('sphere-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Initialize Three.js scene
    function init() {
      scene = new THREE.Scene();
      
      // Camera setup
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.z = 30;
      
      // Renderer setup
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setClearColor(0xffffff, 0);
      container.appendChild(renderer.domElement);
      
      // Create nodes (representing tasks)
      createNodes();
      
      // Add sphere container for nodes
      createSphere();
      
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 10, 10);
      scene.add(directionalLight);
      
      // Add event listeners
      window.addEventListener('resize', onWindowResize);
      container.addEventListener('mousemove', onMouseMove);
      
      // Add controls
      setupControls();
      
      // Start animation loop
      animate();
    }
    
    function createNodes() {
      const colors = [0x6c5ce7, 0xfdcb6e, 0xff7675, 0x55efc4, 0x74b9ff];
      const nodeCount = 15;
      
      for (let i = 0; i < nodeCount; i++) {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({
          color: colors[Math.floor(Math.random() * colors.length)],
          shininess: 100
        });
        
        const node = new THREE.Mesh(geometry, material);
        
        // Random position within a sphere
        const theta = THREE.MathUtils.randFloatSpread(360);
        const phi = THREE.MathUtils.randFloatSpread(180);
        const radius = 10 + Math.random() * 3;
        
        node.position.x = radius * Math.sin(theta) * Math.cos(phi);
        node.position.y = radius * Math.sin(theta) * Math.sin(phi);
        node.position.z = radius * Math.cos(theta);
        
        scene.add(node);
        nodes.push(node);
        
        // Create connections between some nodes
        if (i > 0 && Math.random() > 0.5) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            node.position,
            nodes[Math.floor(Math.random() * i)].position
          ]);
          
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xcccccc,
            transparent: true,
            opacity: 0.5
          });
          
          const line = new THREE.Line(lineGeometry, lineMaterial);
          scene.add(line);
        }
      }
    }
    
    function createSphere() {
      const geometry = new THREE.SphereGeometry(12, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color: 0x6c5ce7,
        transparent: true,
        opacity: 0.05,
        wireframe: true
      });
      
      sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
    }
    
    function setupControls() {
      const zoomIn = document.getElementById('zoom-in');
      const zoomOut = document.getElementById('zoom-out');
      const rotate = document.getElementById('rotate');
      
      zoomIn.addEventListener('click', () => {
        camera.position.z -= 2;
      });
      
      zoomOut.addEventListener('click', () => {
        camera.position.z += 2;
      });
      
      let isRotating = true;
      rotate.addEventListener('click', () => {
        isRotating = !isRotating;
      });
    }
    
    function onWindowResize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    
    function onMouseMove(event) {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / height) * 2 + 1;
  }
  
  function animate() {
    requestAnimationFrame(animate);
    
    // Rotate sphere slightly
    sphere.rotation.y += 0.002;
    sphere.rotation.x += 0.001;
    
    // Subtle camera movement based on mouse position
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.01;
    camera.position.y += (mouseY * 2 - camera.position.y) * 0.01;
    camera.lookAt(scene.position);
    
    // Animate nodes
    nodes.forEach((node, index) => {
      // Make nodes pulse slightly
      const time = Date.now() * 0.001;
      const pulseFactor = Math.sin(time + index) * 0.05 + 1;
      node.scale.set(pulseFactor, pulseFactor, pulseFactor);
      
      // Subtle orbital movement
      const orbitSpeed = 0.001 * (index % 3 + 1);
      const distance = node.position.length();
      
      node.position.x = Math.cos(time * orbitSpeed) * distance;
      node.position.z = Math.sin(time * orbitSpeed) * distance;
    });
    
    renderer.render(scene, camera);
  }
  
  init();
}

// Chart for Insights
function initInsightsView() {
  const ctx = document.getElementById('productivity-chart').getContext('2d');
  
  // Sample data
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Focus Score',
        data: [65, 78, 52, 91, 85, 60, 75],
        borderColor: '#6c5ce7',
        backgroundColor: 'rgba(108, 92, 231, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Tasks Completed',
        data: [4, 6, 3, 7, 5, 2, 4],
        borderColor: '#fdcb6e',
        backgroundColor: 'rgba(253, 203, 110, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1'
      }
    ]
  };
  
  // Chart configuration
  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            boxWidth: 6
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#2d3436',
          bodyColor: '#2d3436',
          borderColor: '#dfe6e9',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y1: {
          beginAtZero: true,
          position: 'right',
          grid: {
            display: false
          }
        },
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      }
    }
  };
  
  // Create chart
  new Chart(ctx, config);
}