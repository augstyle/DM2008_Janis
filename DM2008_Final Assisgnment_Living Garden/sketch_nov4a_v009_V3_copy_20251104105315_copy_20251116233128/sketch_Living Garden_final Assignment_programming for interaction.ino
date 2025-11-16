#include <Adafruit_NeoPixel.h>

#define PIXEL_PIN   6      // Flora -> NeoPixel data
#define PIXEL_COUNT 5      // how many pixels you actually wired
#define TOUCH_PIN   10     // your metal fabric pad

Adafruit_NeoPixel pixels(PIXEL_COUNT, PIXEL_PIN, NEO_GRB + NEO_KHZ800);

// Hysteresis thresholds (tune if needed)
const int ON_THR  = 340;   // go ON above this
const int OFF_THR = 300;   // go OFF below this

bool isOn  = false;
bool wasOn = false;

int smoothRead(uint8_t pin, int samples = 8) {
  long sum = 0;
  for (int i = 0; i < samples; i++) {
    sum += analogRead(pin);
    delay(2);
  }
  return sum / samples;
}

void showAll(uint8_t r, uint8_t g, uint8_t b) {
  for (int i = 0; i < PIXEL_COUNT; i++) pixels.setPixelColor(i, pixels.Color(r, g, b));
  pixels.show();
}

void setup() {
  pixels.begin();
  pixels.clear();              // ensure OFF at boot
  pixels.show();
  delay(20);

  Serial.begin(115200);        // if you’ll use p5, keep Monitor closed
}

void loop() {
  // smoothed capacitive-ish reading
  int touchValue = smoothRead(TOUCH_PIN);

  // hysteresis
  if (!isOn && touchValue > ON_THR)  isOn = true;
  if ( isOn && touchValue < OFF_THR) isOn = false;

  // your LED behavior
  if (isOn) {
    // pick any color you like here:
    showAll(255, 80, 60);      // warm red/orange
  } else {
    pixels.clear();
    pixels.show();
  }

  // tell p5 only when it changes
  if (isOn != wasOn) {
    Serial.println(isOn ? "ON" : "OFF");
    wasOn = isOn;
  }

  delay(15);
}
