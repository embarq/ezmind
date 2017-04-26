import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer,
  ViewChild
} from '@angular/core';
import {
  DataSet,
  Edge,
  Node,
  Network
} from 'vis';

export const defaultNodeShape = 'circularImage';

export const getRadomString = () => new Array(12).fill(null).reduce((accum, curr) => accum + String.fromCharCode(Math.floor(Math.random() * 90) - 10), '')

@Component({
  selector: 'em-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnDestroy, OnInit {
  @ViewChild('editor') public editor: ElementRef;
  @ViewChild('editModeSource') public editModeSource: ElementRef;

  public network: Network;
  public networkNodes: DataSet<Node>;
  public networkEdges: DataSet<Edge>;
  public selectedNode: string;
  public editMode: boolean;

  constructor(private renderer: Renderer) {
    this.selectedNode = null;
  }

  private handleNodeClick(event) {
    if (event.nodes.length > 0 && event.nodes.length < 2) {
      this.selectedNode = event.nodes[0];
    }
  }

  private handleNodeDeselect() {
    this.selectedNode = null;
    this.editMode = false;
  }

  public ngOnDestroy() {
    this.network.off('selectNode');
    this.network.off('deselectEdge');
  }

  public ngOnInit() {
    this.networkNodes = new DataSet([
      {
        id: getRadomString(),
        label: 'Central theme',
        image: 'http://25.media.tumblr.com/tumblr_m2oh0gcbo61qdwizao1_250.jpg'
      }
    ]);

    this.networkEdges = new DataSet();

    this.network = new Network(this.editor.nativeElement, {
      nodes: this.networkNodes,
      edges: this.networkEdges
    }, {
      nodes: {
        borderWidth: 1,
        color: {
          border: '#f55',
          background: '#f55'
        },
        shape: defaultNodeShape,
      }
    });

    this.network.on('selectNode', event => this.handleNodeClick(event));
    this.network.on('deselectNode', event => this.handleNodeDeselect());
  }

  public handleAdd(
    label = 'New Node',
    image = 'http://25.media.tumblr.com/tumblr_m2oh0gcbo61qdwizao1_250.jpg'
  ) {
    const [ newNodeId ] = this.networkNodes.add({
      id: getRadomString(),
      label,
      image
    });
    let parentNode = this.selectedNode || this.networkNodes.max('id').id;

    this.networkEdges.add({
      from: parentNode,
      to: newNodeId,
      id: `${ parentNode }-${ newNodeId }`
    });
  }

  public handleEdit() {
    const editableValue = this.networkNodes.get(this.selectedNode).label;
    this.editModeSource.nativeElement.value = editableValue;
    this.editMode = true;
  }

  public handleRemove() {
    this.networkNodes.remove(this.selectedNode);
    this.selectedNode = null;
  }

  public cancelEditMode() {
    this.editMode = false;
    this.editModeSource.nativeElement.value = null;
  }

  public saveChanges() {
    this.editMode = false;
    const updatedLabel = this.editModeSource.nativeElement.value;
    this.networkNodes.update({
      id: this.selectedNode,
      label: updatedLabel
    });
  }

  public handleDrop(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    
    const file = event.dataTransfer.files[0];
    const url = URL.createObjectURL(file);
    
    this.handleAdd(file.name, url);
  }

  public handleDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();

    event.dataTransfer.dropEffect = 'copy';
  }

}
