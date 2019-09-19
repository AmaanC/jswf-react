import React, { Component, createRef, ReactElement } from "react";
import { TreeItem, TreeItemProps } from "./Item/TreeItem";
import { Root } from "./TreeView.style";
import { objectAssign } from "../lib/Manager";

interface Props {
  itemStyle?: number;
  onExpand?: (item: TreeItem, expand: boolean) => void;
  onItemClick?: (item: TreeItem) => void;
  onItemDoubleClick?: (item: TreeItem) => void;
}
interface State {
  item: TreeItemProps;
}

/**
 *TreeViewクラス
 *
 * @export
 * @class TreeView
 * @extends {Component<Props, State>}
 */
export class TreeView extends Component<Props, State> {
  private rootItemRef = createRef<TreeItem>();
  private select: TreeItem | null = null;
  private item: TreeItemProps;

  public constructor(props: Props) {
    super(props);
    const rootItem = this.props.children as ReactElement;
    if (rootItem && rootItem.type === TreeItem) {
      this.item = { ...rootItem.props };
    } else {
      this.item = { label: "Root" };
    }
    this.state = { item: this.item };
  }
  public render() {
    return (
      <Root>
        <TreeItem
          {...this.state.item}
          ref={this.rootItemRef}
          uniqueKey={1}
          key={1}
          itemStyle={this.props.itemStyle}
          treeView={this}
          parent={this}
        ></TreeItem>
      </Root>
    );
  }
  public setProps(_item: TreeItem, props: TreeItemProps) {
    objectAssign(this.item, props);
    this.setState({ item: { ...this.item } });
  }
  public getProps<K extends keyof TreeItemProps>(
    _item: TreeItem,
    key: K
  ): TreeItemProps[K] {
    return this.item[key];
  }
  /**
   *Rootアイテムを返す
   *
   * @returns {TreeItem}
   * @memberof TreeView
   */
  public getItem(): TreeItem {
    return this.rootItemRef.current!;
  }
  /**
   *該当する値を持つアイテムを一つ返す
   *
   * @param {unknown} value
   * @returns {(TreeItem | null)}
   * @memberof TreeView
   */
  public findItem(value: unknown): TreeItem | null {
    return this.rootItemRef.current!.findItem(value);
  }
  /**
   *該当する値を持つアイテムを複数返す
   *
   * @param {unknown} value
   * @returns {TreeItem[]}
   * @memberof TreeView
   */
  public findItems(value: unknown): TreeItem[] {
    return this.rootItemRef.current!.findItems(value);
  }
  /**
   *アイテムを削除する
   *
   * @param {TreeItem} item
   * @returns {boolean}
   * @memberof TreeView
   */
  public delItem(item: TreeItem): boolean {
    return this.rootItemRef.current!.delItem(item);
  }
  /**
   *選択中のアイテムを返す
   *
   * @returns {(TreeItem | null)}
   * @memberof TreeView
   */
  public getSelectItem(): TreeItem | null {
    return this.select;
  }
  /**
   *アイテムを選択する
   *
   * @param {(TreeItem | null)} item
   * @memberof TreeView
   */
  public selectItem(item: TreeItem | null): void {
    if (this.select) this.select.onSelect(false);
    if (item) item.onSelect(true);
    this.select = item;
  }
  /**
   *チェック中のアイテムを複数返す
   *
   * @returns {TreeItem[]}
   * @memberof TreeView
   */
  public getCheckItems(): TreeItem[] {
    return this.rootItemRef.current!.getCheckItems();
  }
}
