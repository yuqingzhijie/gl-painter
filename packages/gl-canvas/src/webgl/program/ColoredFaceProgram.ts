import WebglProgram from '../WebglProgram'

export default class ColoredFaceProgram extends WebglProgram {
  static vertSource = `
    uniform mat4 uVertexMatrix;
    uniform mat4 uNormalMatrix;
    
    attribute vec3 aVertex;
    attribute vec3 aNormal;

    varying vec3 vVertex;
    varying vec3 vNormal;

    void main() {
        vec4 vertex = uVertexMatrix * vec4(aVertex, 1.0);
        vec4 normal = uNormalMatrix * vec4(aNormal, 0.0);
        vVertex = vertex.xyz;
        vNormal = normalize(normal.xyz);
        gl_Position = vertex;
    }
    `
  static fragSource = `
    precision mediump float;
    
    uniform vec4 uColor;
    uniform vec3 uAmbientLightColor;
    uniform vec3 uDirectionalLightDirection;
    uniform vec3 uDirectionalLightColor;
    
    varying vec3 vVertex;
    varying vec3 vNormal;

    void main() {
        vec3 normal = normalize(vNormal);
        vec3 lightDirection = normalize(uDirectionalLightDirection);
        vec3 diffuse = uDirectionalLightColor * uColor.rgb * max(dot(lightDirection, normal), 0.0);
        vec3 ambient = uAmbientLightColor * uColor.rgb;
        vec3 viewPointVertex = vec3(1, 1, 2);
        vec3 surfaceToViewDirection = normalize(viewPointVertex - vVertex);
        vec3 halfVector = normalize(surfaceToViewDirection + lightDirection);
        float specular = max(dot(normal, halfVector), 0.0);
        specular = pow(specular, 40.0) / 2.0;

        // vec3 point = normalize(vVertex.xyz);
        // if (dot(vVertex.xyz, vec3(0, 0, 1.0)) > -0.005) {
            gl_FragColor = vec4(diffuse + ambient, uColor.a);
            gl_FragColor.rgb += specular;
        // } else {
        //     discard;
        // }
    }
    `

  constructor(webgl: WebGLRenderingContext) {
    super(webgl, ColoredFaceProgram.vertSource, ColoredFaceProgram.fragSource)
    this.vertexAttribPosition = webgl.getAttribLocation(this.program, 'aVertex')
    this.normalAttribPosition = webgl.getAttribLocation(this.program, 'aNormal')

    this.normalMatrixUniformPosition = webgl.getUniformLocation(
      this.program,
      'uNormalMatrix',
    ) as WebGLUniformLocation
    this.colorUniformPosition = webgl.getUniformLocation(
      this.program,
      'uColor',
    ) as WebGLUniformLocation
    this.ambientColorUniformPosition = webgl.getUniformLocation(
      this.program,
      'uAmbientLightColor',
    ) as WebGLUniformLocation
    this.lightDirectionUniformPosition = webgl.getUniformLocation(
      this.program,
      'uDirectionalLightDirection',
    ) as WebGLUniformLocation
    this.lightColorUniformPosition = webgl.getUniformLocation(
      this.program,
      'uDirectionalLightColor',
    ) as WebGLUniformLocation
  }

  vertexAttribPosition: number
  normalAttribPosition: number

  normalMatrixUniformPosition: WebGLUniformLocation
  colorUniformPosition: WebGLUniformLocation
  ambientColorUniformPosition: WebGLUniformLocation
  lightDirectionUniformPosition: WebGLUniformLocation
  lightColorUniformPosition: WebGLUniformLocation
}
