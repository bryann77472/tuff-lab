# BENGALA INTELIGENTE PARA DEFICIENTES VISUAIS

## Código
```c++
const int pinTrigger = 13;
const int pinEcho = 12;
const int buzzer = 3;
const int motor = 4;

const float velocidadeSom = 0.000340;

float tempoEcho;
float distancia;

void setup() {
  pinMode(pinTrigger, OUTPUT);
  digitalWrite(pinTrigger, LOW);
  
  pinMode(buzzer, OUTPUT);
  digitalWrite(buzzer, LOW);
  
  pinMode(motor, OUTPUT);
  digitalWrite(motor, LOW);
  
  pinMode(pinEcho, INPUT);
  
  Serial.begin(9600);
}

void loop() {
  disparaPulsoUltrassonico();
  
  tempoEcho = pulseIn(pinEcho, HIGH);
  distancia = ((tempoEcho * velocidadeSom) / 2) * 100;
  
  Serial.print("Distancia: ");
  Serial.print(distancia);
  Serial.println(" cm");
  
  if (distancia > 120) {
    // Fora do alcance → quieto
    digitalWrite(buzzer, LOW);
    digitalWrite(motor, LOW);
    delay(200);
  }
  else if (distancia > 90) {
    // Nível 1 - mais fraco
    apitar(500, 80, 500);
  }
  else if (distancia > 60) {
    // Nível 2
    apitar(800, 100, 300);
  }
  else if (distancia > 30) {
    // Nível 3 - forte
    apitar(1100, 130, 150);
  }
  else {
    // Nível 4 - urgência máxima
    apitar(1600, 180, 40);
  }
}

void apitar(int frequencia, int duracao, int intervalo) {
  tone(buzzer, frequencia, duracao);
  digitalWrite(motor, HIGH);
  delay(duracao);
  digitalWrite(motor, LOW);
  delay(intervalo);
}

void disparaPulsoUltrassonico() {
  digitalWrite(pinTrigger, HIGH);
  delayMicroseconds(10);
  digitalWrite(pinTrigger, LOW);
}
```
